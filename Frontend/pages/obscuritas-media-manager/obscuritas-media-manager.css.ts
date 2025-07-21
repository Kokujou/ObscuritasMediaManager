import { css } from 'lit-element';

export function renderObscuritasMediaManagerStyles() {
    return css`
        :host {
            position: relative;
            width: 100%;
            height: 100%;
            display: block;
        }
    `;
    // return css`
    //     page-routing {
    //         transition: display, opacity 4s ease;
    //     }
    //     #active {
    //         opacity: 1;
    //     }
    //     #inactive {
    //         opacity: 0;
    //         display: none;
    //     }
    //     [invisible] {
    //         opacity: 0;
    //         position: absolute;
    //         pointer-events: none;
    //     }
    // `;
}
