import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { scrollIntoParentViewX } from '../../services/extensions/document.extensions';
import { renderSideScrollerStyles } from './side-scroller.css';
import { renderSideScroller } from './side-scroller.html';

@customElement('side-scroller')
export class SideScroller extends LitElementBase {
    static override get styles() {
        return renderSideScrollerStyles();
    }

    static get properties() {
        return {};
    }

    get scrollContainer() {
        var container = this.shadowRoot!.querySelector<HTMLElement>('#content-container')!;
        return container;
    }

    get scrollItemcontainer() {
        var container = this.shadowRoot!.querySelector<HTMLElement>('#item-container')!;
        return container;
    }

    get scrollChildren() {
        return this.shadowRoot!.querySelector('slot')!
            .assignedElements()
            .filter((x) => x.className != 'inner-space') as HTMLElement[];
    }

    get canScrollLeft() {
        return this.currentItemIndex > 0;
    }

    get canScrollRight() {
        return this.currentItemIndex < this.children.length - 1;
    }

    @state() currentItemIndex = -1;

    updated(_changedProperties: Map<any, any>) {
        super.updated(_changedProperties);
        setTimeout(() => {
            this.requestFullUpdate();
            if (this.currentItemIndex < 0) this.currentItemIndex = Math.floor(this.scrollChildren.length / 2);
            var element = this.scrollChildren[this.currentItemIndex];
            scrollIntoParentViewX(element, this.scrollItemcontainer, this.scrollContainer);
            this.requestFullUpdate();
        }, 100);
    }

    override render() {
        return renderSideScroller.call(this);
    }

    scrollToLeft() {
        if (this.currentItemIndex <= 0) return;
        this.currentItemIndex--;
        var element = this.scrollChildren[this.currentItemIndex];
        scrollIntoParentViewX(element, this.scrollItemcontainer, this.scrollContainer);
        this.requestFullUpdate();
    }

    scrollToRight() {
        var children = this.scrollChildren;
        if (this.currentItemIndex >= children.length - 1) return;
        this.currentItemIndex++;
        var element = this.scrollChildren[this.currentItemIndex];
        scrollIntoParentViewX(element, this.scrollItemcontainer, this.scrollContainer);
        this.requestFullUpdate();
    }
}
