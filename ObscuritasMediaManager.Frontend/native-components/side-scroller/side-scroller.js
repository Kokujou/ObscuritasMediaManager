import { LitElement } from '../../exports.js';
import { scrollIntoParentViewX } from '../../services/extensions/document.extensions.js';
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

    /** @returns {HTMLElement} */
    get scrollItemcontainer() {
        var container = this.shadowRoot.getElementById('item-container');
        return container;
    }

    get scrollChildren() {
        return this.shadowRoot
            .querySelector('slot')
            .assignedElements()
            .filter((x) => x.className != 'inner-space')
            .map(/** @param {HTMLElement} x */ (x) => x);
    }

    get canScrollLeft() {
        return this.currentItemIndex > 0;
    }

    get canScrollRight() {
        return this.currentItemIndex < this.children.length - 1;
    }

    constructor() {
        super();

        this.currentItemIndex = -1;
    }

    updated(_changedProperties) {
        super.updated(_changedProperties);
        setTimeout(() => {
            this.requestUpdate(undefined);
            if (this.currentItemIndex < 0) this.currentItemIndex = Math.floor(this.scrollChildren.length / 2);
            var element = this.scrollChildren[this.currentItemIndex];
            scrollIntoParentViewX(element, this.scrollItemcontainer, this.scrollContainer);
            this.requestUpdate(undefined);
        }, 100);
    }

    render() {
        return renderSideScroller(this);
    }

    async scrollToLeft() {
        if (this.currentItemIndex <= 0) return;
        this.currentItemIndex--;
        var element = this.scrollChildren[this.currentItemIndex];
        scrollIntoParentViewX(element, this.scrollItemcontainer, this.scrollContainer);
        this.requestUpdate(undefined);
    }

    scrollToRight() {
        var children = this.scrollChildren;
        if (this.currentItemIndex >= children.length - 1) return;
        this.currentItemIndex++;
        var element = this.scrollChildren[this.currentItemIndex];
        scrollIntoParentViewX(element, this.scrollItemcontainer, this.scrollContainer);
        this.requestUpdate(undefined);
    }
}
