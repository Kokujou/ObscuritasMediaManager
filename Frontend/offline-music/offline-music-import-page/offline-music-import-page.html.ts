import { html } from 'lit';
import { OfflineMusicPage } from '../offline-music-page/offline-music-page';
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
                    <label>Musik-Daten:</label>
                    <custom-toggle
                        ?toggled="${this.musicTotal
                            ? this.musicMetadataImported! >= this.musicTotal
                            : this.musicMetadataImported > 0}"
                    ></custom-toggle>
                    <div class="import-count-label">
                        ${this.musicTotal
                            ? `${this.musicMetadataImported}/${this.musicTotal}`
                            : this.musicMetadataImported || null}
                    </div>
                    <flex-space></flex-space>
                    <div
                        class="delete-action"
                        tooltip="Löschen"
                        @click="${() => {
                            this.database?.clearStore(OfflineMusicPage.MusicStoreName);
                            this.loadData();
                        }}"
                    ></div>
                </flex-row>

                <flex-row class="import-status">
                    <label>Musik:</label>
                    <custom-toggle
                        ?toggled="${this.musicTotal ? this.musicImported! >= this.musicTotal : this.musicImported > 0}"
                    ></custom-toggle>
                    <div class="import-count-label">
                        ${this.musicTotal ? `${this.musicImported}/${this.musicTotal}` : this.musicImported || null}
                    </div>
                    <flex-space></flex-space>
                    <div class="delete-action" tooltip="Löschen" @click="${() => this.deleteMusicCache()}"></div>
                </flex-row>

                <flex-row class="import-status">
                    <label>Playlists:</label>
                    <custom-toggle
                        ?toggled="${this.playlistsTotal
                            ? this.playlistsImported! >= this.playlistsTotal
                            : this.playlistsImported > 0}"
                    ></custom-toggle>
                    <div class="import-count-label">
                        ${this.playlistsTotal
                            ? `${this.playlistsImported}/${this.playlistsTotal}`
                            : this.playlistsImported || null}
                    </div>
                    <flex-space></flex-space>
                    <div
                        class="delete-action"
                        tooltip="Löschen"
                        @click="${() => {
                            this.database?.clearStore(OfflineMusicPage.PlaylistsStoreName);
                            this.loadData();
                        }}"
                    ></div>
                </flex-row>
                <flex-row class="import-status">
                    <label>Instrumente:</label>
                    <custom-toggle
                        ?toggled="${this.instrumentsTotal
                            ? this.instrumentsImported! >= this.instrumentsTotal
                            : this.instrumentsImported > 0}"
                    ></custom-toggle>
                    <div class="import-count-label">
                        ${this.instrumentsTotal
                            ? `${this.instrumentsImported}/${this.instrumentsTotal}`
                            : this.instrumentsImported || null}
                    </div>

                    <flex-space></flex-space>

                    <div
                        class="delete-action"
                        tooltip="Löschen"
                        @click="${() => {
                            this.database?.clearStore(OfflineMusicPage.InstrumentsStoreName);
                            this.loadData();
                        }}"
                    ></div>
                </flex-row>
            </flex-column>

            ${this.offlineMode
                ? html`
                      <div id="offline-mode-text">
                          Die Anwendung läuft im Offline-Modus. Daten können nicht importiert werden. Gelöschte Daten können nicht
                          wiederhergestellt werden!
                      </div>
                  `
                : ''}

            <flex-row id="actions">
                ${this.schemaConsistent
                    ? html` <border-button
                          id="submit-button"
                          text="Weiter zur Anwendung"
                          @click="${() => location.reload()}"
                      ></border-button>`
                    : null}
                ${!this.databaseConsistent && !this.offlineMode
                    ? html`
                          <border-button
                              id="submit-button"
                              text="Importieren"
                              @click="${() => this.importData()}"
                              ?disabled="${this.importing}"
                          ></border-button>
                      `
                    : null}
            </flex-row>
        </flex-column>
    `;
}
