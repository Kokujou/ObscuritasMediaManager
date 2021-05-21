import { LitElement } from '../../exports.js';
import { renderSideScrollerStyles } from './side-scroller.css.js';
import { renderSideScroller } from './side-scroller.html.js';

export class SideScroller extends LitElement {
    static get styles() {
        return renderSideScrollerStyles();
    }

    static get properties() {
        return {};
    }

    /** @returns {HTMLElement} */
    get scrollContainer() {
        var container = this.shadowRoot.getElementById('content-container');
        return container;
    }

    get scrollChildren() {
        return this.shadowRoot
            .querySelector('slot')
            .assignedElements()
            .filter((x) => x.className != 'inner-space');
    }

    get canScrollLeft() {
        return this.currentItemIndex > 0;
    }

    get canScrollRight() {
        return this.currentItemIndex < this.children.length - 1;
    }

    constructor() {
        super();

        this.currentItemIndex = 0;
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        setTimeout(() => {
            this.requestUpdate(undefined);
            this.currentItemIndex = Math.floor(this.scrollChildren.length / 2);
            console.log(this.scrollChildren);
            this.scrollChildren[this.currentItemIndex].scrollIntoView({ block: 'end', inline: 'center', behavior: 'smooth' });
            this.requestUpdate(undefined);
        }, 100);
    }

    render() {
        return renderSideScroller(this);
    }

    async scrollToLeft() {
        if (this.currentItemIndex <= 0) return;
        this.currentItemIndex--;
        this.scrollChildren[this.currentItemIndex].scrollIntoView({ block: 'end', inline: 'center', behavior: 'smooth' });
        this.requestUpdate(undefined);
    }

    scrollToRight() {
        var children = this.scrollChildren;
        if (this.currentItemIndex >= children.length - 1) return;
        this.currentItemIndex++;
        this.scrollChildren[this.currentItemIndex].scrollIntoView({ block: 'end', inline: 'center', behavior: 'smooth' });
        this.requestUpdate(undefined);
    }
}
