import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderLoadingCircleStyles } from './loading-circle.css';
import { renderLoadingCircle } from './loading-circle.html';

@customElement('loading-circle')
export class LoadingCircle extends LitElementBase {
    static override get styles() {
        return renderLoadingCircleStyles();
    }

    override render() {
        return renderLoadingCircle(this);
    }
}
