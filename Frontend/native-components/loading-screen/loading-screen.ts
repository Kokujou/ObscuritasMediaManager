const html = (strings: TemplateStringsArray, ...values: any[]) => {
    var resultString = '';
    if (strings.length % 2 != 0 && strings.length != 1)
        throw new Error(`string array length must be dividable by 2, but is ${strings.length}`);
    for (var i = 0, j = 0; i < strings.length; i++) {
        resultString += strings[i];
        if (i % 2 == 0) {
            resultString += `${values[j] || ''}`;
            j++;
        }
    }
    return resultString;
};

export class LoadingScreen extends HTMLElement {
    static get tag() {
        return 'loading-screen';
    }

    constructor() {
        super();
        var shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<style>@import "./native-components/loading-screen/loading-screen.css";</style>`;
        shadow.innerHTML += LoadingScreen.renderLoadingScreen();
    }

    static renderLoadingScreen() {
        return html`<div id="wrapper">
            <div id="icon-container">${this.renderLoadingIcon()}</div>
        </div> `;
    }

    static renderLoadingIcon() {
        return html`
            <style>
                @import './native-components/loading-screen/loading-icon.css';
            </style>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 931.25 931.25">
                <defs />
                <g fill="none">
                    <g stroke-linecap="round">
                        <path
                            id="inner-circle"
                            d="M884.566 465.406c0 231.373-187.564 418.937-418.937 418.937-231.372 0-418.936-187.564-418.936-418.937 0-231.372 187.564-418.937 418.936-418.937 231.373 0 418.937 187.565 418.937 418.937z"
                        />
                        <path
                            id="outer-circle"
                            d="M926.259 465.63C926.259 211.23 720.029 5 465.629 5 211.231 5 5 211.23 5 465.63c0 254.398 206.232 460.63 460.63 460.63 254.4 0 460.63-206.232 460.63-460.63z"
                        />
                    </g>
                    <path
                        id="septagram"
                        d="M395.88 716.526h-51.013m-32.072-40.28l51.265.253M238.296 518.663l-31.82-39.878m76.921-156.16l11.34-49.911m170.892-37.322c15.417-7.38 30.834-14.762 46.25-22.143m171.786 82.858l-46.071-22.143m11.339 49.732c15.298 7.38 30.595 14.762 45.893 22.143m41.16 182.946l-11.25-50m-20.714 90.179l-11.25-50M586.167 716.905l31.82-40.154M465.625 868.22c-40.264-50.635-80.609-101.205-120.906-151.813-64.25-.111-128.5-.257-192.75-.343C166.29 653.524 180.68 591 195.03 528.468c-40-50.209-80.004-100.413-120-150.625 57.877-27.664 115.75-55.334 173.625-83 14.37-62.54 28.691-125.092 43.094-187.625 57.992 27.953 115.979 55.917 173.969 83.875 58.448-27.947 116.89-55.906 175.344-83.844 14.159 62.965 28.378 125.916 42.562 188.875 57.283 27.611 114.548 55.259 171.844 82.844-39.817 49.936-79.603 99.897-119.407 149.844 14.145 62.802 28.301 125.602 42.438 188.406-64.094-.086-128.187-.233-192.281-.344-40.197 50.449-80.404 100.89-120.594 151.344zm.031-64.188l69.5-87.25-139.218-.281 69.718 87.531zM728.47 677.125l-24.375-108.188-86.063 108 110.438.188zM567 676.844l125.813-157.938-43.97-195.125-183.218-88.344-182.281 87.157-45 196.031L364.03 676.438l202.969.406zm-254.187-.5l-85.907-107.875-24.718 107.687 110.625.188zM724.78 478.812l68.188-85.562c-32.709-15.77-65.417-31.542-98.125-47.313l29.937 132.875zm-518.312-.187l30.75-133.969-99.531 47.594 68.78 86.375zm431.156-204.656l-24.562-109-101.188 48.375 125.75 60.625zm-342.844-1.188l124.688-59.594L319.53 165l-24.75 107.781zm240.374 444.124l31.82-40.154M465.629 191.107l-46.25 22.142m-170.714 81.518l-11.428 49.911m-42.251 183.834l31.946 39.9"
                    />
                </g>
            </svg>
        `;
    }
}

if (!window.customElements.get(LoadingScreen.tag)) {
    window.customElements.define(LoadingScreen.tag, LoadingScreen);
}
