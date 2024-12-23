import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderMaintenancePageStyles } from './maintenance-page.css';
import { renderMaintenancePage } from './maintenance-page.html';

@customElement('maintenance-page')
export class MaintenancePage extends LitElementBase {
    static isPage = true as const;

    static override get styles() {
        return renderMaintenancePageStyles();
    }

    @property() public declare someProperty: string;

    override render() {
        return renderMaintenancePage.call(this);
    }
}
