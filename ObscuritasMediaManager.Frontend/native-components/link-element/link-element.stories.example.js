import { html } from '@open-wc/demoing-storybook';
import { select } from 'storybook-prebuilt/addon-knobs';
export const LinkElementExample = () => html` <storybook-theme-tester theme="${select('Theme', theme, 'dark', 'Theming')}">
    <link-element> </link-element>
</storybook-theme-tester>`;
