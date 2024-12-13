import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderBorderButtonStyles } from './border-button.css';
import { renderBorderButton } from './border-button.html';

@customElement('border-button')
export class BorderButton extends LitElementBase {
    static override get styles() {
        return renderBorderButtonStyles();
    }

    @property() public declare text: string;

    override render() {
        return renderBorderButton(this);
    }
}
