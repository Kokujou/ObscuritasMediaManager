import { loadingIcon } from '../../resources/inline-icons/general/loading.icon.svg.js';

const html = (strings, ...values) => {
    let result = '';

    for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
            result += values[i];
        }
    }

    return result;
};

class LoadingScreen extends HTMLElement {
    static get tag() {
        return 'loading-screen';
    }

    constructor() {
        super();
        var shadow = this.attachShadow({ mode: 'open' });
        const cssUrl = new URL('./loading-screen.css', import.meta.url);
        shadow.innerHTML = `
        <style>@import "${cssUrl.href}";</style>
        ${LoadingScreen.renderLoadingScreen()}
    `;
    }

    static renderLoadingScreen() {
        return html`<div id="wrapper">
            <div id="icon-container">${this.renderLoadingIcon()}</div>
        </div> `;
    }

    static renderLoadingIcon() {
        const cssUrl = new URL('./loading-icon.css', import.meta.url);
        return html`
            <style>
                @import '${cssUrl.href}';
            </style>

            ${loadingIcon()}
        `;
    }
}

if (!window.customElements.get(LoadingScreen.tag)) {
    window.customElements.define(LoadingScreen.tag, LoadingScreen);
}
