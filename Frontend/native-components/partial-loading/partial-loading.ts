import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderPartialLoading } from './partial-loading.html';

@customElement('partial-loading')
export class PartialLoading extends LitElementBase {
    @property({ type: Boolean, reflect: true }) public declare hideText: boolean;

    override render() {
        return renderPartialLoading();
    }
}
