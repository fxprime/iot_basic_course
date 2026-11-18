// Arithmatex isolates equations from code samples and ordinary lesson text.
window.MathJax = {
    tex: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
    },
    options: {
        ignoreHtmlClass: '.*|',
        processHtmlClass: 'arithmatex'
    },
    startup: {
        pageReady() {
            return MathJax.startup.defaultPageReady().then(() => {
                // Material replaces article content without reloading scripts.
                document$.subscribe(() => {
                    MathJax.startup.promise = MathJax.startup.promise.then(() => {
                        MathJax.typesetClear();
                        MathJax.texReset();
                        return MathJax.typesetPromise();
                    });
                });
            });
        }
    }
};
