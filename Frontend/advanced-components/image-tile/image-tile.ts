import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderWebcomponentTemplateStyles as renderImageTileStyles } from './image-tile.css';
import { renderWebcomponentTemplate as renderImageTile } from './image-tile.html';

@customElement('image-tile')
export class ImageTile extends LitElementBase {
    static override get styles() {
        return renderImageTileStyles();
    }

    @property() declare public caption: string;
    @property() declare public src: string;

    override render() {
        return renderImageTile.call(this);
    }
}
