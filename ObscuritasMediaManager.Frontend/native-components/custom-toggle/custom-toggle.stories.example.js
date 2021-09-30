// @ts-ignore
import { html } from '@open-wc/demoing-storybook';

export const CustomToggleExample = () => html` <style>
        custom-toggle {
            margin: 50px;
            transform: scale(5);
            transform-origin: 0 0;
            --toggled-color: red;
        }
    </style>
    <page-routing><custom-toggle> </custom-toggle></page-routing>`;
