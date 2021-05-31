```js script
import { html } from '@open-wc/demoing-storybook';
import { withKnobs, text, select, array } from 'storybook-prebuilt/addon-knobs';
import { DropDown } from './drop-down.js';

export default {
    title: 'DropDown',
    component: 'drop-down',
    options: { selectedPanel: 'storybookjs/knobs/panel' },
    decorators: [withKnobs],
};
```

# NavItem

A custom dropdown with custom styles and custom functionality

## Properties:

-   **options** (Array): The texts to display when clicking the dropdown.
-   **currentIndex** (Number): Sets the current index of the selected item.
-   **maxDisplayDepth** (Number): Sets the max number of items displayed when opening the dropdown.

## Examples:

```js preview-story
import { DropDownStyles } from './drop-down.js';
export const Multiple = () => html`
    <style>
        .dropdown {
            position: absolute;
            width: 500px;
            height: 50px;
            margin: 50px;
        }

        body {
            background-color: var(--ahp-blue5-color);
            color: black;
        }
    </style>
    <page-routing>
        <storybook-theme-tester theme="${select('Theme', theme, 'light', 'Theming')}"></storybook-theme-tester>

        <div class="dropdown">
            <drop-down
                maxDisplayDepth="3"
                .options="${array('Options', ['optionA', 'optionB', 'optionC'])}"
                value="${text('Value', 'optionA')}"
                displayStyle="${select('Style', DropDownStyles, 'compact', 'Theming')}"
            ></drop-down>
        </div>
    </page-routing>
`;
export const Required = () => html`
    <style>
        .dropdown {
            position: absolute;
            width: 500px;
            height: 50px;
            margin: 50px;
        }

        body {
            background-color: var(--ahp-blue5-color);
            color: black;
        }
    </style>
    <page-routing>
        <storybook-theme-tester theme="${select('Theme', theme, 'light', 'Theming')}"></storybook-theme-tester>

        <div class="dropdown">
            <drop-down
                maxDisplayDepth="3"
                .options="${array('Options', ['optionA', 'optionB', 'optionC'])}"
                value="${text('Value', 'optionA')}"
                required
                @change="${(e) => console.log(e)}"
                displayStyle="${select('Style', DropDownStyles, 'compact', 'Theming')}"
            ></drop-down>
        </div>
    </page-routing>
`;
```
