// @ts-nocheck
const path = require('path');
const glob = require('glob');

module.exports = function loader() {
    const dir = path.resolve(this.rootContext, '');
    const files = glob
        .sync(`${dir.replace(/\\/g, '/')}/**/*.ts`, {
            ignore: ['**/node_modules/**', '**/dist/**', '**/templates/**'],
        })
        .map((x) => `import ${JSON.stringify(x)}`);

    this.addContextDependency(dir);
    return files.join('\n');
};
