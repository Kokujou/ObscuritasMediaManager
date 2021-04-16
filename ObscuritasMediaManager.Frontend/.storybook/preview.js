import { addParameters } from '@open-wc/demoing-storybook';
import '../custom-elements.js';

addParameters({
    docs: {
        iframeHeight: '200px',
    },
    options: {
        enableShortcuts: false,
    },
});

async function run() {}

run();
