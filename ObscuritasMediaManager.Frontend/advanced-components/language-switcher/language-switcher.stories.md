```js script
import { html } from '@open-wc/demoing-storybook';
import { withKnobs, text, select } from 'storybook-prebuilt/addon-knobs';

const navigationTexts = ['Start', 'App Store', 'Services', 'Notifications', 'Help'];
const navigationTargets = ['start', 'appstore', 'services', 'notifications', 'help'];

export default {
    title: 'LanguageSwitcher',
    component: 'language-switcher',
    options: { selectedPanel: 'storybookjs/knobs/panel' },
    decorators: [withKnobs],
};
```

# Webcomponent Template

## Properties:

-   **someProperty** (PropertyType): Describe all your public properties, their type and how they will affect your webcomponent

## Slots:

-   **(unnamed)**: if available, describe your defined slots and how they will displayed in the component

## Events:

-   **someEvent**: if available, describe the events triggered by your webcomponent, what data they will return and when they will be triggered

## Style parameters:

-   **--your-css-variable**: if used, describe what css variables your component exposes

## Examples:

give an example on how to implement your webcomponent. to enable our AHP styling you need to put the empty storybook-theme-tester inside the page-routing.
use available knob-functions to make properties or contents of your webcomponent configurable in the storybook

```js preview-story
import { LanguageSwitcher } from './language-switcher.js';

var languageSwitcher = null;

function showLanguageSwitcher() {
    var parent = document.querySelector('#language-switcher-viewport');
    if (!languageSwitcher) languageSwitcher = LanguageSwitcher.spawnAt(parent, null);
    else {
        languageSwitcher.destroy();
        languageSwitcher = null;
    }
}

export const Multiple = () => html`
    <style>
        #language-switcher-viewport {
            position: absolute;
            left: 30px;
            top: 30px;
            width: 400px;
            height: 400px;
        }
    </style>
    <page-routing>
        <div id="language-switcher-viewport"></div>
        <input type="button" value="click to show language switcher" @click="${showLanguageSwitcher}" />
    </page-routing>
`;
```
