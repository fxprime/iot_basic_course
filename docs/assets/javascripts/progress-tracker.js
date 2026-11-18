/**
 * IoT reading tracker, using the Loadcell course's section markers, storage keys,
 * chapter snapshots and /api/progress contract.
 */
(function () {
    'use strict';

    const registryUrl = new URL('../section-registry.json', document.currentScript.src);
    const siteUrl = new URL('../', registryUrl);
    const contextKey = 'tracking_context_iot_basic_course';
    const threshold = 0.3;
    const viewDurationMs = 1000;
    const state = {
        sections: {},
        completed: new Set(),
        timers: new Map(),
        observer: null,
        userId: 'anonymous',
        courseId: 'iot_basic_course',
        sessionId: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    };
    let sendQueue = Promise.resolve();

    function read(storage, key, fallback) {
        try {
            return JSON.parse(storage.getItem(key)) || fallback;
        } catch (error) {
            return fallback;
        }
    }

    function write(storage, key, value) {
        try {
            storage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('[ProgressTracker] Could not save browser state:', error.message);
        }
    }

    function progressKey() {
        return `progress_${state.courseId}_${state.userId}`;
    }

    function saveProgress() {
        write(localStorage, progressKey(), {
            completedSections: Array.from(state.completed),
            lastUpdated: new Date().toISOString()
        });
    }

    function loadProgress() {
        const saved = read(localStorage, progressKey(), {});
        state.completed = new Set((saved.completedSections || [])
            .filter(id => Object.hasOwn(state.sections, id)));
    }

    function setContext(userId, courseId) {
        state.userId = userId || 'anonymous';
        state.courseId = courseId || 'iot_basic_course';
        write(sessionStorage, contextKey, { userId: state.userId, courseId: state.courseId });
        loadProgress();
        observePage();
        sendProgress('init', 'Initial Page Load');
    }

    function snapshot() {
        const chapters = {};
        for (const section of Object.values(state.sections)) {
            const chapter = chapters[section.chapterId] ||= {
                chapterId: section.chapterId, sections: [],
                completedCount: 0, totalCount: 0, percentage: 0
            };
            const completed = state.completed.has(section.sectionId);
            chapter.sections.push({
                sectionId: section.sectionId, title: section.title, completed,
                pageUrl: new URL(section.pageUrl, siteUrl).pathname
            });
            chapter.totalCount++;
            if (completed) chapter.completedCount++;
        }
        for (const chapter of Object.values(chapters)) {
            chapter.percentage = Math.round(chapter.completedCount / chapter.totalCount * 100);
        }
        const total = Object.keys(state.sections).length;
        return {
            chapters,
            overall: {
                completed: state.completed.size, total,
                percentage: total ? Math.round(state.completed.size / total * 100) : 0
            },
            completedSections: Array.from(state.completed)
        };
    }

    function queueSnapshot(eventData) {
        const key = `pending_progress_${eventData.courseId}_${eventData.userId}`;
        write(localStorage, key, eventData);
        // Preserve snapshot order when several headings complete together.
        sendQueue = sendQueue.then(async () => {
            try {
                const response = await fetch('/api/progress', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(eventData), keepalive: true
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const result = await response.json();
                const pending = read(localStorage, key, null);
                if (pending && JSON.stringify(pending) === JSON.stringify(eventData)) {
                    localStorage.removeItem(key);
                }
                if (result.triggerQuiz && eventData.userId === state.userId &&
                    eventData.courseId === state.courseId) {
                    triggerQuiz(eventData.trigger.sectionId, result.quizData);
                }
            } catch (error) {
                console.warn('[ProgressTracker] Progress retained for retry:', error.message);
            }
        });
    }

    function sendProgress(sectionId, sectionTitle) {
        // Standalone anonymous reading is saved locally; the API needs a user.
        if (state.userId === 'anonymous' || !Object.keys(state.sections).length) return;
        queueSnapshot({
            userId: state.userId, courseId: state.courseId, sessionId: state.sessionId,
            timestamp: new Date().toISOString(), pageUrl: window.location.href,
            progress: snapshot(), trigger: { sectionId, sectionTitle }
        });
    }

    function retryPending() {
        if (state.userId === 'anonymous') return;
        const pending = read(localStorage, `pending_progress_${state.courseId}_${state.userId}`, null);
        if (pending) queueSnapshot(pending);
    }

    function clearTimer(id) {
        const pending = state.timers.get(id);
        if (!pending) return;
        clearTimeout(pending.timer);
        pending.element.classList.remove('progress-in-progress');
        state.timers.delete(id);
    }

    function stopObserving() {
        if (state.observer) state.observer.disconnect();
        for (const id of state.timers.keys()) clearTimer(id);
    }

    function observePage() {
        stopObserving();
        const elements = document.querySelectorAll('[data-progress-section]');
        for (const element of elements) {
            element.classList.toggle('progress-completed', state.completed.has(element.dataset.progressSection));
        }
        if (document.hidden) return;
        state.observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                const element = entry.target;
                const id = element.dataset.progressSection;
                if (!entry.isIntersecting || entry.intersectionRatio < threshold) {
                    clearTimer(id);
                    continue;
                }
                if (!Object.hasOwn(state.sections, id) || state.completed.has(id) || state.timers.has(id)) continue;
                element.classList.add('progress-in-progress');
                const timer = setTimeout(() => {
                    clearTimer(id);
                    if (document.hidden || !element.isConnected) return;
                    state.completed.add(id);
                    element.classList.add('progress-completed');
                    state.observer.unobserve(element);
                    saveProgress();
                    sendProgress(id, element.dataset.progressTitle);
                }, viewDurationMs);
                state.timers.set(id, { timer, element });
            }
        }, { threshold: [0, threshold, 1], rootMargin: '-64px 0px 0px 0px' });
        for (const element of elements) state.observer.observe(element);
    }

    function triggerQuiz(sectionId, quizData) {
        const data = {
            type: 'TRIGGER_QUIZ', sectionId, quizData,
            userId: state.userId, courseId: state.courseId
        };
        if (window.parent !== window) window.parent.postMessage(data, window.location.origin);
        document.dispatchEvent(new CustomEvent('progressQuizTrigger', { detail: data }));
    }

    function handleParentMessage(event) {
        if (event.source !== window.parent || event.origin !== window.location.origin || !event.data) return;
        const { type, data } = event.data;
        if (type === 'SET_USER_ID' && typeof data?.userId === 'string') {
            setContext(data.userId, state.courseId);
        } else if (type === 'SET_COURSE_ID' && typeof data?.courseId === 'string') {
            setContext(state.userId, data.courseId);
        } else if (type === 'GET_PROGRESS') {
            window.parent.postMessage({ type: 'PROGRESS_DATA', data: window.ProgressTracker.getProgress() }, event.origin);
        }
    }

    async function init() {
        try {
            const response = await fetch(registryUrl);
            if (!response.ok) throw new Error(`Registry HTTP ${response.status}`);
            const registry = await response.json();
            state.sections = registry.sections;
        } catch (error) {
            console.error('[ProgressTracker] Section registry unavailable:', error.message);
            return;
        }
        const params = new URLSearchParams(window.location.search);
        const saved = read(sessionStorage, contextKey, {});
        state.userId = params.get('user_id') || saved.userId || 'anonymous';
        state.courseId = params.get('course_id') || saved.courseId || 'iot_basic_course';
        write(sessionStorage, contextKey, { userId: state.userId, courseId: state.courseId });
        loadProgress();
        retryPending();

        window.ProgressTracker = {
            getProgress: () => ({
                completedSections: Array.from(state.completed),
                userId: state.userId, courseId: state.courseId,
                ...snapshot()
            }),
            setUserId: id => setContext(id, state.courseId),
            setCourseId: id => setContext(state.userId, id),
            resetProgress: () => {
                state.completed.clear();
                saveProgress();
                observePage();
                sendProgress('reset', 'Progress Reset');
            }
        };
        window.addEventListener('message', handleParentMessage);
        window.addEventListener('online', retryPending);
        document.addEventListener('visibilitychange', observePage);
        // Material emits once on load and on each instant page navigation.
        if (typeof document$ !== 'undefined') document$.subscribe(observePage);
        else observePage();
        sendProgress('init', 'Initial Page Load');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();
