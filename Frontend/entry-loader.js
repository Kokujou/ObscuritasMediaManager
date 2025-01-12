// @ts-nocheck
const path = require('path');
const glob = require('glob');

module.exports = function loader() {
    const dir = path.resolve(this.rootContext, '');

    const allFiles = glob.sync(`${dir.replace(/\\/g, '/')}/**/*.ts`, {
        ignore: ['**/node_modules/**', '**/dist/**', '**/templates/**'],
    });
    const componentFiles = allFiles.filter((file) => allFiles.includes(file.replace('.ts', '.html.ts')));
    const imports = componentFiles.map((x) => `import ${JSON.stringify(x)}`);

    this.addContextDependency(dir);
    return imports.join('\n');
};
