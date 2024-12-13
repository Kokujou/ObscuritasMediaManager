import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { Mood } from '../../obscuritas-media-manager-backend-client';
import { getTargetScrollPosition, scrollIntoParentViewY } from '../../services/extensions/document.extensions';
import { renderScrollSelectStyles } from './scroll-select.css';
import { renderScrollSelect } from './scroll-select.html';

@customElement('scroll-select')
export class ScrollSelect extends LitElementBase {
    static override get styles() {
        return renderScrollSelectStyles();
    }

    static get properties() {
        return {
            options: { type: Array, reflect: true },
            value: { type: String, reflect: true },
        };
    }

    get scrollContainer() {
        var container = this.shadowRoot!.querySelector<HTMLElement>('#scroll-items')!;
        return container;
    }

    get scrollItemsContainer() {
        var container = this.shadowRoot!.querySelector<HTMLElement>('#item-container')!;
        return container;
    }

    get scrollChildren() {
        return [...this.shadowRoot!.querySelectorAll<HTMLElement>('#item-container > *:not(.inner-space)')];
    }

    get canScrollUp() {
        return this.currentItemIndex > 0;
    }

    get canScrollBottom() {
        return this.currentItemIndex < this.children.length - 1;
    }

    @property() options = [];
    @property() value = Mood.Unset;

    @state() protected declare currentItemIndex: number;
    @state() protected declare mouseDown: boolean;
    @state() protected declare mouseStartY: number;

    override connectedCallback() {
        document.addEventListener('pointermove', (e) => this.onPointerMove(e));
        document.addEventListener('pointerup', () => this.onPointerUp());
    }

    updated(_changedProperties: Map<any, any>) {
        super.updated(_changedProperties);

        if (!_changedProperties.has('value') || !this.value) return;

        this.currentItemIndex = this.options.findIndex((x) => x == this.value);
        this.notifyValueChanged();
    }

    override render() {
        return renderScrollSelect.call(this);
    }

    scrollToTop() {
        if (this.currentItemIndex <= 0) return;
        this.currentItemIndex--;
        this.notifyValueChanged();
    }

    scrollToBottom() {
        if (this.currentItemIndex >= this.scrollChildren.length - 1) return;
        this.currentItemIndex++;
        this.notifyValueChanged();
    }

    scrollToItem(value: string) {
        var index = this.options.findIndex((x) => x == value);
        this.currentItemIndex = index;
        this.notifyValueChanged();
    }

    startDragScrolling() {
        this.mouseDown = true;
        var element = this.scrollChildren[this.currentItemIndex];
        this.mouseStartY = getTargetScrollPosition(element, element.parentElement!, this.scrollContainer).top;
        this.scrollItemsContainer.classList.toggle('user-interaction', true);
        this.requestFullUpdate();
    }

    onPointerMove(e: PointerEvent) {
        if (!this.mouseDown) return;
        var deltaY = e.movementY;
        this.mouseStartY += deltaY * 3;
        this.scrollItemsContainer.style.transform = `translateY(${this.mouseStartY}px)`;
    }

    onPointerUp() {
        if (!this.mouseDown) return;
        this.mouseDown = false;

        var currentScrollTop = this.mouseStartY;
        this.scrollItemsContainer.classList.toggle('user-interaction', false);
        this.scrollChildren.forEach((item, index) => {
            var targetTop = getTargetScrollPosition(item, item.parentElement!, this.scrollContainer).top;
            if (currentScrollTop > targetTop - item.offsetHeight / 2 && currentScrollTop < targetTop + item.offsetHeight / 2) {
                this.currentItemIndex = index;
            }
        });

        this.notifyValueChanged();
    }

    notifyValueChanged() {
        var element = this.scrollChildren[this.currentItemIndex];
        setTimeout(() => {
            scrollIntoParentViewY(element, element.parentElement!, this.scrollContainer);
        }, 100);

        this.dispatchEvent(new CustomEvent('valueChanged', { detail: { value: this.options[this.currentItemIndex] } }));
        this.requestFullUpdate();
    }
}
