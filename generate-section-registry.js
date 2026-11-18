#!/usr/bin/env node
// Generate the same registry schema as the Loadcell course, for active IoT chapters.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const docsDir = path.join(__dirname, 'docs');
const chapterDir = path.join(docsDir, 'esp32');
const outputFile = path.join(docsDir, 'assets/section-registry.json');
const sections = {};
const chapters = fs.readdirSync(chapterDir).filter(name => /^\d{2}-.+\.md$/.test(name)).sort();
assert.equal(chapters.length, 14, 'Expected all 14 active chapters');

for (const filename of chapters) {
    const sourceFile = `esp32/${filename}`;
    const content = fs.readFileSync(path.join(docsDir, sourceFile), 'utf8');
    let fence = null;
    let count = 0;
    for (const line of content.split('\n')) {
        const boundary = line.match(/^\s*(`{3,}|~{3,})/);
        if (boundary) {
            fence = fence ? null : boundary[1][0];
            continue;
        }
        if (fence) continue;
        const marker = line.match(/data-progress-section="([^"]+)"\s+data-progress-title="([^"]+)"/);
        if (!marker) continue;
        const [, sectionId, encodedTitle] = marker;
        assert(!sections[sectionId], `Duplicate section ID: ${sectionId}`);
        assert(sectionId.startsWith(`${filename.slice(0, 2)}-`), `Wrong chapter for ${sectionId}`);
        const title = encodedTitle.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        sections[sectionId] = {
            sectionId, title, chapterId: filename.slice(0, 2),
            pageUrl: sourceFile.replace(/\.md$/, '/'), sourceFile
        };
        count++;
    }
    assert(count > 0, `No tracked sections in ${sourceFile}`);
}

const registry = { totalSections: Object.keys(sections).length, sections };
if (process.argv.includes('--check')) {
    const saved = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    assert.deepEqual({ totalSections: saved.totalSections, sections: saved.sections }, registry,
        'Registry is stale. Run node generate-section-registry.js');
    console.log(`Registry OK: ${registry.totalSections} sections across ${chapters.length} chapters`);
} else {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    const previous = fs.existsSync(outputFile) ? JSON.parse(fs.readFileSync(outputFile, 'utf8')) : {};
    // Keep rebuilds reproducible when markers have not changed.
    const unchanged = JSON.stringify(previous.sections) === JSON.stringify(sections);
    const generatedAt = unchanged ? previous.generatedAt : new Date().toISOString();
    fs.writeFileSync(outputFile, JSON.stringify({ generatedAt, ...registry }, null, 2) + '\n');
    console.log(`Generated ${registry.totalSections} sections across ${chapters.length} chapters`);
}
