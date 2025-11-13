import { css } from 'lit-element';

export function renderInventoryContainerStyles() {
    return css`
        :host {
            display: flex;
            flex-direction: column;

            padding-bottom: 20px;
            border-radius: 20px;
            overflow: hidden;

            font-size: 16px;

            --base: #0b0b0d; /* very dark base */
            --mid1: #1a1a1f;
            --mid2: #2b2b32;
            background: linear-gradient(
                    90deg,
                    var(--mid1) 0%,
                    var(--mid2) 25%,
                    var(--base) 50%,
                    var(--mid2) 75%,
                    var(--mid1) 100%
                ),
                radial-gradient(120px 60px at 20% 20%, rgba(255, 255, 255, 0.06), transparent 30%),
                linear-gradient(100deg, transparent 0 40%, rgba(255, 255, 255, 0.08) 41% 44%, transparent 45% 100%);
            border: 2px solid white;
        }

        #content {
            backdrop-filter: blur(20px);
            align-items: stretch;
        }

        #container-caption {
            text-align: center;
            padding: 20px 0;
            font-weight: bold;
        }

        #levels {
            align-items: stretch;
            gap: 20px;
        }

        .level {
            min-height: 150px;
            border: 4px solid white;
            border-radius: 20px;
            flex-wrap: wrap;
            gap: 20px;
            margin: 0 40px;
            padding: 20px;

            background: #fff5;
        }

        .level[dragged-over] {
            border: 4px solid blue;
        }

        .plus-icon {
            padding: 20px;
            background: black;

            border-radius: 20px;

            cursor: pointer;
            user-select: none;
        }
    `;
}
