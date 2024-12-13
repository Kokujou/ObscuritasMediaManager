import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderCreateMediaPageStyles } from './create-media-page.css';
import { renderCreateMediaPage } from './create-media-page.html';

@customElement('create-media-page')
export class CreateMediaPage extends LitElementBase {
    static isPage = true as const;

    static override get styles() {
        return renderCreateMediaPageStyles();
    }

    override render() {
        return renderCreateMediaPage.call(this);
    }
}
