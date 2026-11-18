#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const courseDir = path.resolve(__dirname, '..');
const siteDir = path.resolve(process.argv[2] || path.join(courseDir, 'site'));
const registry = JSON.parse(fs.readFileSync(path.join(courseDir, 'docs/assets/section-registry.json')));
const builtRegistry = JSON.parse(fs.readFileSync(path.join(siteDir, 'assets/section-registry.json')));
assert.deepEqual(builtRegistry, registry, 'Built registry is stale');
const seen = new Set();
const equations = { '06': 1, '07': 1, '08': 2, '09': 1 };
const sources = [...new Set(Object.values(registry.sections).map(section => section.sourceFile))];

for (const sourceFile of sources) {
    const chapterId = path.basename(sourceFile).slice(0, 2);
    const htmlPath = path.join(siteDir, sourceFile.replace(/\.md$/, '/index.html'));
    const html = fs.readFileSync(htmlPath, 'utf8');
    const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
    assert(article, `Missing article in ${sourceFile}`);
    for (const heading of article.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/g)) {
        const id = heading[1].match(/data-progress-section="([^"]+)"/)?.[1];
        assert(id, `Missing section marker in ${sourceFile}: ${heading[2]}`);
        assert(!seen.has(id), `Duplicate built marker ${id}`);
        assert.equal(registry.sections[id]?.sourceFile, sourceFile, `Unregistered marker ${id}`);
        seen.add(id);
    }
    for (const paragraph of article.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
        const text = paragraph[1].replace(/<[^>]*>/g, '');
        assert(!/\n(?:[-*+] |\d+\. )/.test(text), `Collapsed list in ${sourceFile}: ${text}`);
        assert(!text.includes('$$'), `Raw math delimiters in ${sourceFile}`);
    }
    assert.equal((article.match(/class="arithmatex"/g) || []).length, equations[chapterId] || 0,
        `Wrong equation count in ${sourceFile}`);
    // MkDocs leaves broken chapter links pointing at .md files.
    assert(!/href="[^"#?]*\.md(?:[#?"])/.test(article), `Broken chapter link in ${sourceFile}`);
    assert(html.includes('assets/javascripts/progress-tracker.js'), `Tracker missing from ${sourceFile}`);
    assert(html.includes('assets/javascripts/mathjax.js'), `Math loader missing from ${sourceFile}`);
}
assert.equal(seen.size, registry.totalSections, 'Not all registry sections render');
console.log(`Course OK: ${sources.length} chapters, ${seen.size} rendered sections, 5 equations, no collapsed lists or broken chapter links`);
