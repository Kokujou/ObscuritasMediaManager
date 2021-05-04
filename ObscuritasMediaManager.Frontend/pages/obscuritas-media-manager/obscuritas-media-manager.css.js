import { css } from '../../exports.js';

export function renderObscuritasMediaManagerStyles() {
    return css`
        page-routing {
            transition: display, opacity 4s ease;
        }

        #loading-overlay {
            position: fixed;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;

            background-color: #222255;

            display: flex;
            align-items: center;
            justify-content: center;
            transition: display, opacity 2s ease;
        }

        #active {
            opacity: 1;
        }

        #inactive {
            opacity: 0;
            display: none;
        }

        #loading-icon {
            position: absolute;

            --donut-chart-border-width: 10px;
            --circle-radius: calc(100% - var(--donut-chart-border-width));
            --donut-mask: radial-gradient(
                circle farthest-side at center center,
                transparent var(--circle-radius),
                #000 calc(var(--circle-radius)) calc(var(--circle-radius) + var(--donut-chart-border-width)),
                transparent calc(var(--circle-radius) + var(--donut-chart-border-width)) 100%
            );
            mask: var(--donut-mask);
            -webkit-mask: var(--donut-mask);
            border-radius: 50%;

            transform: rotate(50deg);
            background: #550077;
            animation: fade-expand 2s infinite ease;
            border-color: 5px solid black;

            display: flex;
            align-items: center;
            justify-content: center;

            width: 0%;
            padding-top: 0%;
        }

        #outer {
            animation-delay: 2s;
        }

        #inner-1 {
            animation-delay: 1.5s;
        }

        #inner-2 {
            animation-delay: 1s;
        }

        #inner-3 {
            animation-delay: 0.5s;
        }

        @keyframes fade-expand {
            from {
            }

            to {
                width: 30%;
                padding-top: 30%;
                background-color: #22003300;
            }
        }
    `;
}
