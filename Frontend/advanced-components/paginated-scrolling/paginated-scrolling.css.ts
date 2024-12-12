import { css } from 'lit-element';

export function renderPaginatedScrollingStyles() {
    return css`
        * {
            scrollbar-width: thin;
        }

        :host {
            position: relative;
        }

        .scroll-container {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;

            overflow-y: scroll;
            mask: linear-gradient(to bottom, transparent, black 10% 90%, transparent);
        }
    `;
}
