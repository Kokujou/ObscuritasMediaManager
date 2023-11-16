import { LitElementBase } from '../../data/lit-element-base.js';
import { renderLoadingCircleStyles } from './loading-circle.css.js';
import { renderLoadingCircle } from './loading-circle.html.js';

export class LoadingCircle extends LitElementBase {
    static get styles() {
        return renderLoadingCircleStyles();
    }

    render() {
        return renderLoadingCircle(this);
    }
}
