import { html } from '@open-wc/demoing-storybook';
import { select } from 'storybook-prebuilt/addon-knobs';
import { theme } from '../../shared/theme.js';
export const MediaPlaylistExample = () => html` <storybook-theme-tester
    theme="${select('Theme', theme, 'dark', 'Theming')}"
>
    <media-playlist> </media-playlist>
</storybook-theme-tester>`;
