import { html } from 'lit';
import { MaintenancePage } from './maintenance-page';

export function renderMaintenancePage(this: MaintenancePage) {
    return html` <page-layout> Wartung! Services sind nicht gestartet. </page-layout> `;
}
