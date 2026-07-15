import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { getTargetScrollPosition, scrollIntoParentViewY } from '../../extensions/document.extensions';
import { Mood } from '../../obscuritas-media-manager-backend-client';
import { renderScrollSelectStyles } from './scroll-select.css';
import { renderScrollSelect } from './scroll-select.html';

@customElement('scroll-select')
export class ScrollSelect extends LitElementBase {
    static override get styles() {
        return renderScrollSelectStyles();
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

    @property({ type: Array }) declare public options: string[];
    @property() declare public value: string;

    @state() declare protected currentItemIndex: number;
    @state() declare protected mouseDown: boolean;
    @state() declare protected dragPosY: number;
    @state() declare protected mouseStartY: number;
    @state() declare protected wasDragging: boolean;

    constructor() {
        super();
        this.value = Mood.Unset;
        this.options = [];
    }

    override connectedCallback() {
        super.connectedCallback();

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
        this.wasDragging = false;
        var element = this.scrollChildren[this.currentItemIndex];
        this.dragPosY = getTargetScrollPosition(element, element.parentElement!, this.scrollContainer).top;
        this.mouseStartY = this.dragPosY;
        this.scrollItemsContainer.classList.toggle('user-interaction', true);
        this.requestFullUpdate();
    }

    onPointerMove(e: PointerEvent) {
        if (!this.mouseDown) return;

        var deltaY = e.movementY;
        this.dragPosY += deltaY * 1.5;

        console.log(this.mouseStartY - this.dragPosY);
        if (Math.abs(this.mouseStartY - this.dragPosY) > 5) this.wasDragging = true;

        this.scrollItemsContainer.style.transform = `translateY(${this.dragPosY}px)`;
    }

    onPointerUp() {
        if (!this.mouseDown) return;
        this.mouseDown = false;

        this.scrollItemsContainer.classList.toggle('user-interaction', false);
        const matrix = new DOMMatrix(getComputedStyle(this.scrollItemsContainer).transform);

        const currentTranslateY = matrix.m42;
        let closestIndex = 0;
        let closestDistance = Infinity;

        this.scrollChildren.forEach((item, index) => {
            const targetTop = getTargetScrollPosition(item, item.parentElement!, this.scrollContainer).top;

            const distance = Math.abs(currentTranslateY - targetTop);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        this.currentItemIndex = closestIndex;
        this.value = this.options[this.currentItemIndex];
        this.requestFullUpdate();
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
