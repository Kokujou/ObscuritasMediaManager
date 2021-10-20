import { html } from '@open-wc/demoing-storybook';
import { select } from 'storybook-prebuilt/addon-knobs';
import { theme } from '../../shared/theme.js';
export const PartialLoadingExample = () => html` <storybook-theme-tester
    theme="${select('Theme', theme, 'dark', 'Theming')}"
>
    <partial-loading> </partial-loading>
</storybook-theme-tester>`;
