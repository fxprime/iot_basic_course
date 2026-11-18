const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const registry = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/assets/section-registry.json')));
const source = fs.readFileSync(path.join(__dirname, '../docs/assets/javascripts/progress-tracker.js'), 'utf8');
const ids = Object.keys(registry.sections);
const settle = async () => { for (let i = 0; i < 8; i++) await new Promise(setImmediate); };
const memoryStorage = () => {
    const data = new Map();
    return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
};

async function harness(query = '?user_id=reader-a&course_id=iot-test', localStorage = memoryStorage(), sessionStorage = memoryStorage()) {
    const timers = new Map();
    const documentListeners = {};
    const windowListeners = {};
    const navigation = [];
    const requests = [];
    const observers = [];
    let timerId = 0;
    let offline = false;
    function element(id) {
        const classes = new Set();
        return {
            dataset: { progressSection: id, progressTitle: registry.sections[id].title },
            isConnected: true,
            classList: {
                add: name => classes.add(name), remove: name => classes.delete(name),
                contains: name => classes.has(name),
                toggle: (name, on) => on ? classes.add(name) : classes.delete(name)
            }
        };
    }
    let elements = [element(ids[0]), element(ids[1])];
    const document = {
        currentScript: { src: 'https://example.test/docs/iot_basic_course/site/assets/javascripts/progress-tracker.js' },
        readyState: 'complete', hidden: false,
        querySelectorAll: () => elements,
        addEventListener: (name, callback) => { documentListeners[name] = callback; },
        dispatchEvent: () => {}
    };
    const location = { href: `https://example.test/docs/iot_basic_course/site/esp32/01-download-ide/${query}`, search: query, origin: 'https://example.test' };
    const window = {
        location, addEventListener: (name, callback) => { windowListeners[name] = callback; }
    };
    window.parent = window;
    class IntersectionObserver {
        constructor(callback, options) {
            this.callback = callback; this.options = options; this.observed = new Set();
            observers.push(this);
        }
        observe(element) { this.observed.add(element); }
        unobserve(element) { this.observed.delete(element); }
        disconnect() { this.observed.clear(); }
    }
    const context = vm.createContext({
        window, document, localStorage, sessionStorage, location, URL, URLSearchParams,
        console: { warn() {}, error: console.error }, IntersectionObserver,
        setTimeout: callback => { timers.set(++timerId, callback); return timerId; },
        clearTimeout: id => timers.delete(id),
        document$: { subscribe: callback => { navigation.push(callback); callback(); } },
        fetch: async (url, options) => {
            if (String(url).endsWith('/assets/section-registry.json')) return { ok: true, json: async () => registry };
            assert.equal(url, '/api/progress');
            if (offline) return { ok: false, status: 503 };
            requests.push(JSON.parse(options.body));
            return { ok: true, json: async () => ({ success: true }) };
        }
    });
    vm.runInContext(source, context);
    await settle();
    return {
        window, document, requests, observers, timers, localStorage, sessionStorage, windowListeners,
        get elements() { return elements; },
        setOffline: value => { offline = value; },
        progress: () => JSON.parse(JSON.stringify(window.ProgressTracker.getProgress())),
        intersect: (index, ratio) => observers.at(-1).callback([{
            target: elements[index], isIntersecting: ratio > 0, intersectionRatio: ratio
        }]),
        tick: async () => {
            for (const [id, callback] of Array.from(timers)) {
                if (!timers.has(id)) continue;
                timers.delete(id); callback();
            }
            await settle();
        },
        navigate: id => {
            elements.forEach(element => { element.isConnected = false; });
            elements = [element(id)];
            navigation.forEach(callback => callback());
        },
        visibility: hidden => { document.hidden = hidden; documentListeners.visibilitychange(); }
    };
}

test('only sustained visible headings complete; payload uses fixed whole-course totals', async () => {
    const h = await harness();
    assert.equal(h.progress().overall.total, registry.totalSections);
    assert.equal(h.requests[0].trigger.sectionId, 'init');
    assert.equal(Object.keys(h.requests[0].progress.chapters).length, 14);
    assert(h.observers[0].options.threshold.includes(0.3));
    h.intersect(0, 0.29); await h.tick();
    assert.equal(h.progress().overall.completed, 0);
    h.intersect(0, 0.5); h.intersect(0, 0); await h.tick();
    assert.equal(h.progress().overall.completed, 0);
    h.intersect(0, 0.5); await h.tick();
    assert.equal(h.progress().overall.completed, 1);
    assert.equal(h.requests.at(-1).trigger.sectionId, ids[0]);
    assert.equal(h.requests.at(-1).progress.overall.total, registry.totalSections);
    assert(h.requests.at(-1).progress.chapters['01'].sections[0].pageUrl.startsWith('/docs/iot_basic_course/site/esp32/'));
    assert(h.elements[0].classList.contains('progress-completed'));
    h.intersect(0, 1); await h.tick();
    assert.equal(h.requests.length, 2, 'Completed sections must not post twice');
});

test('navigation and hidden tabs cancel timers, then observe only current headings', async () => {
    const h = await harness();
    h.intersect(0, 0.5); h.visibility(true); await h.tick();
    assert.equal(h.progress().overall.completed, 0);
    h.visibility(false); h.intersect(0, 0.5);
    h.navigate(ids.find(id => id.startsWith('02-'))); await h.tick();
    assert.equal(h.progress().overall.completed, 0);
    assert(h.observers.slice(0, -1).every(observer => observer.observed.size === 0));
    h.intersect(0, 1); await h.tick();
    assert.equal(h.progress().overall.completed, 1);
    assert(h.progress().completedSections[0].startsWith('02-'));
});

test('user/course switching, reload, and reset isolate saved progress', async () => {
    const h = await harness();
    h.intersect(0, 1); await h.tick();
    h.window.ProgressTracker.setUserId('reader-b');
    assert.equal(h.progress().overall.completed, 0);
    assert(!h.elements[0].classList.contains('progress-completed'));
    h.window.ProgressTracker.setUserId('reader-a');
    assert.equal(h.progress().overall.completed, 1);
    h.window.ProgressTracker.setCourseId('other-course');
    assert.equal(h.progress().overall.completed, 0);
    h.window.ProgressTracker.setCourseId('iot-test');
    assert.equal(h.progress().overall.completed, 1);
    const reload = await harness('', h.localStorage, h.sessionStorage);
    assert.equal(reload.progress().userId, 'reader-a');
    assert.equal(reload.progress().overall.completed, 1);
    reload.window.ProgressTracker.resetProgress();
    assert.equal(reload.progress().overall.completed, 0);
    await settle();
    assert.equal(reload.requests.at(-1).trigger.sectionId, 'reset');
});

test('failed API snapshots remain queued and retry on reconnect', async () => {
    const h = await harness();
    h.setOffline(true); h.intersect(0, 1); await h.tick();
    assert(h.localStorage.getItem('pending_progress_iot-test_reader-a'));
    h.setOffline(false); h.windowListeners.online(); await settle();
    assert.equal(h.localStorage.getItem('pending_progress_iot-test_reader-a'), null);
    assert.equal(h.requests.at(-1).progress.overall.completed, 1);
});

test('anonymous reading remains local and foreign window messages cannot change identity', async () => {
    const h = await harness('');
    h.intersect(0, 1); await h.tick();
    assert.equal(h.progress().overall.completed, 1);
    assert.equal(h.requests.length, 0);
    h.windowListeners.message({ source: {}, origin: 'https://unrelated.test', data: { type: 'SET_USER_ID', data: { userId: 'intruder' } } });
    assert.equal(h.progress().userId, 'anonymous');
});
