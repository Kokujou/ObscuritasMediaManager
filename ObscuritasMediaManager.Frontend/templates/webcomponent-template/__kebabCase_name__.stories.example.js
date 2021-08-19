import { html } from '@open-wc/demoing-storybook';
import { select } from 'storybook-prebuilt/addon-knobs';
import { theme } from '../../shared/theme.js';
export const {{ pascalCase name }}Example = () => html` <storybook-theme-tester
    theme="${select('Theme', theme, 'dark', 'Theming')}"
>
    <{{ kebabCase name }}> </{{ kebabCase name }}>
</storybook-theme-tester>`;
