```js script
import { html } from '@open-wc/demoing-storybook';
import { withKnobs, text, select } from 'storybook-prebuilt/addon-knobs';

const navigationTexts = ['Start', 'App Store', 'Services', 'Notifications', 'Help'];
const navigationTargets = ['start', 'appstore', 'services', 'notifications', 'help'];

export default {
    title: 'SideScroller',
    component: 'side-scroller',
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
export const Multiple = () => html`
    <style>
        side-scroller {
            width: 300px;
            height: 50px;
            white-space: nowrap;
        }
    </style>
    <page-routing>
        <side-scroller> some extremely long text which is definitely larger than the side scroller container </side-scroller>
    </page-routing>
`;
```
