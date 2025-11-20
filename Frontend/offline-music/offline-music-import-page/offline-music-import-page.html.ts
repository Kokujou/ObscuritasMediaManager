import { html } from 'lit';
import { OfflineMusicImportPage } from './offline-music-import-page';

export function renderOfflineMusicImportPage(this: OfflineMusicImportPage) {
    return html`
        <flex-column id="import-panel">
            <div id="caption">Musik-Import</div>

            <div id="description">
                Um diese Website offline verwenden zu können, müssen vorher Daten von der Online-Version in den Browser-Cache
                importiert werden.
            </div>

            <flex-column id="import-states">
                <flex-row class="import-status">
                    <label>Musik:</label>
                    <custom-toggle ?toggled="${!!this.musicTotal && this.musicImported! >= this.musicTotal}"></custom-toggle>
                    <div class="import-count-label">${this.musicTotal ? `${this.musicImported}/${this.musicTotal}` : ''}</div>
                    <flex-space></flex-space>
                    <div class="import-action" tooltip="Update"></div>
                </flex-row>
                <flex-row class="import-status">
                    <label>Playlists:</label>
                    <custom-toggle
                        ?toggled="${!!this.playlistsTotal && this.playlistsImported! >= this.playlistsTotal}"
                    ></custom-toggle>
                    <div class="import-count-label">
                        ${this.playlistsTotal ? `${this.playlistsImported}/${this.playlistsTotal}` : ''}
                    </div>
                    <flex-space></flex-space>
                    <div class="import-action" tooltip="Update"></div>
                </flex-row>
                <flex-row class="import-status">
                    <label>Instrumente:</label>
                    <custom-toggle
                        ?toggled="${!!this.instrumentsTotal && this.instrumentsImported! >= this.instrumentsTotal}"
                    ></custom-toggle>
                    <div class="import-count-label">
                        ${this.instrumentsTotal ? `${this.instrumentsImported}/${this.instrumentsTotal}` : ''}
                    </div>
                    <flex-space></flex-space>
                    <div class="import-action" tooltip="Update"></div>
                </flex-row>
            </flex-column>

            ${this.databaseConsistent
                ? html` <border-button
                      id="submit-button"
                      text="Weiter zur Anwendung"
                      @click="${() => location.reload()}"
                  ></border-button>`
                : html`
                      <border-button id="submit-button" text="Importieren" @click="${() => this.importData()}"></border-button>
                  `}
        </flex-column>
    `;
}
