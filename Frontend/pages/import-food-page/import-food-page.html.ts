import { html } from 'lit-element';
import { ImportFoodPage } from './import-food-page';

ImportFoodPage.prototype.render = function renderImportFoodPage(this: ImportFoodPage) {
    if (!this.files.map) return;
    return html`
        <div id="page">
            <img id="current-image" src="${this.currentImage}" />
            <div id="other-images-container">
                ${this.files.map(
                    (file, i) =>
                        html`<img
                            class="imported-image"
                            src="${file}"
                            ?current="${this.currentIndex == i}"
                            @click="${() => (this.currentIndex = i)}"
                        />`
                )}
            </div>
        </div>
    `;
};
