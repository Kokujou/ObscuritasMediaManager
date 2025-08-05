import { loadingIcon } from '../../resources/inline-icons/general/loading.icon.svg.js';

const html = (strings, ...values) => {
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

class LoadingScreen extends HTMLElement {
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

            ${loadingIcon()}
        `;
    }
}

if (!window.customElements.get(LoadingScreen.tag)) {
    window.customElements.define(LoadingScreen.tag, LoadingScreen);
}
