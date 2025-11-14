import { css } from 'lit-element';
import { renderMaskImage } from '../../extensions/style.extensions';
import { trashIcon } from '../../pages/media-detail-page/images/trash-icon.svg';
import { plusIcon } from '../../resources/inline-icons/general/plus-icon.svg';

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
            align-items: center;
            padding: 0 40px;
            padding-bottom: 20px;
        }

        #container-caption {
            width: 200px;
            font-size: 30px;
            letter-spacing: 1px;
            padding: 20px 0;
            font-weight: bold;
        }

        #container {
            gap: 20px;
        }

        .levels {
            align-items: stretch;
            gap: 20px;
        }

        #side-levels {
            min-width: 200px;
        }

        #main-levels {
            flex: auto;
        }

        .level {
            position: relative;
            flex-wrap: wrap;
            align-items: flex-start;
            width: unset;

            min-height: 75px;
            border: 4px solid #fff9;
            border-radius: 20px;
            flex-wrap: wrap;
            gap: 10px;
            padding: 20px;

            background: var(--metallic-silver);
        }

        .level::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 1;
            background: #0008;
            pointer-events: none;
            border-radius: inherit;
        }

        .level[dragged-over],
        [dragging] .level:hover {
            border: 4px solid blue;
        }

        .level > * {
            z-index: 55;
        }

        .level-label {
            width: 40px;
            height: 40px;
            margin-left: -40px;
            margin-top: -40px;

            display: flex;
            align-items: center;
            justify-content: center;

            background: var(--metallic-black);
            box-shadow: var(--metallic-black-shadow);
            border: 2px solid #445;
            border-radius: 50%;

            text-shadow: 1px 1px 0 #000;
            font-weight: bold;
            color: #fff9;

            pointer-events: none;
        }

        .drag-action-button,
        .plus-icon {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;

            background: var(--metallic-silver);
            box-shadow: var(--metallic-silver-shadow);
            border: 2px solid #cacade;

            border-radius: 20px;

            color: rgba(0, 0, 0, 0.72);
            text-shadow: 1px 1px 0 #ffffff;
            font-weight: bold;

            cursor: pointer;
            user-select: none;
        }

        .plus-icon {
            padding: 25px;
        }

        .plus-icon::before {
            content: '';
            position: absolute;
            inset: 15px;

            background-color: rgba(0, 0, 0, 0.72);
            filter: drop-shadow(2px 2px 0 white);
            ${renderMaskImage(plusIcon())};
        }

        .drag-actions {
            height: 0;
            opacity: 0;
            transition: height 0.1s 0.1s linear, opacity 0.1s 0s linear;

            align-items: flex-end;
            justify-content: flex-end;
            gap: 10px;
            pointer-events: none;
        }

        .level[dragged-over] .drag-actions,
        [dragging] .level:hover .drag-actions {
            height: 100px;
            opacity: 1;
            transition: height 0.1s linear, opacity 0.1s 0.1s linear;
            pointer-events: all;
        }

        .drag-action-button {
            width: 50px;
            height: 50px;
            border-radius: 50%;

            font-size: 24px;
        }

        .drag-action-button[dragged-over],
        [dragging] .level .drag-action-button:hover {
            filter: brightness(0.8);
        }

        .delete-button {
            position: relative;
            width: 80px;
            height: 80px;
            border-radius: 50px;
            border: 2px solid #60040e;

            background: linear-gradient(
                -72deg,
                #9b0a1a,
                #c11c2e 16%,
                #9b0a1a 21%,
                #c11c2e 24%,
                #60040e 30%,
                #9b0a1a 36%,
                #e03a47 45%,
                #e65b60 60%,
                #9b0a1a 72%,
                #c11c2e 80%,
                #9b0a1a 84%,
                #7f0d16
            );

            box-shadow: 4px 4px 1em rgba(122, 0, 0, 0.55), inset 2px 2px 0 rgba(255, 0, 0, 0.9),
                inset -2px -2px 0 rgba(0, 0, 0, 0.5);
        }

        .delete-button[dragged-over],
        [dragging] .level .delete-button:hover {
            filter: brightness(1.2);
        }

        .delete-icon {
            position: absolute;
            inset: 20px;

            filter: drop-shadow(2px 2px #e65b60);
        }

        .delete-icon::before {
            content: '';
            position: absolute;
            inset: 0;

            background: #60040e;
            ${renderMaskImage(trashIcon())};
        }
    `;
}
