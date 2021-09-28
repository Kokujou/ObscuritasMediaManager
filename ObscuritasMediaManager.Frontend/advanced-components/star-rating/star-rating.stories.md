```js script
import { html } from '@open-wc/demoing-storybook';
import { withKnobs } from 'storybook-prebuilt/addon-knobs';

export default {
    title: 'StarRating',
    component: 'star-rating',
    options: { selectedPanel: 'storybookjs/knobs/panel' },
    decorators: [withKnobs],
};
```

# StarRating

shortly describe what your webcomponent is and how it behaves or looks like.
before you use the webcomponent it needs to be implemented in
[../custom-elements.js](custom-elements.js)


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
import { StarRatingExample } from './star-rating.stories.example.js';
export const Multiple = () => StarRatingExample();
```
