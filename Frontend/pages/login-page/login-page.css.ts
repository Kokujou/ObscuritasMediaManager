import { css } from 'lit-element';

export function renderLoginPageStyles() {
    return css`
        #page-container {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        #login-form {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 500px;
            gap: 50px;
        }

        .floating-container {
            position: relative;
            width: 100%;
        }

        .floating-container:focus-within label,
        label[float] {
            top: calc(-100% - 20px);
            transform: scale(0.75);
        }

        label {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            pointer-events: none;

            transform-origin: left;
            transition: all 0.2s linear;

            font-size: 16px;
        }

        input[type='text'],
        input[type='password'] {
            background: none;
            border: none;
            outline: none;
            border-bottom: 2px solid;
            color: white;
            font-size: 16px;

            width: 100%;
            padding: 10px;
        }

        #submit-button {
            align-self: flex-end;
            background: white;
            border: none;
            outline: none;
            padding: 10px 50px;

            font-size: 16px;
        }
    `;
}
