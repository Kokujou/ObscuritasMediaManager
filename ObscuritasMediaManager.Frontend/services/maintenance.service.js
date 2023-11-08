import { Session } from '../data/session.js';
import { DialogBase } from '../dialogs/dialog-base/dialog-base.js';
import { SelectOptionsDialog } from '../dialogs/select-options-dialog/select-options-dialog.js';
import { MusicModel } from '../obscuritas-media-manager-backend-client.js';
import { CleanupService, MusicService } from './backend.services.js';

export class MaintenanceService {
    /**
     * @returns {Promise<boolean>}
     */
    static cleanMedia() {
        return new Promise(async (resolve) => {
            var complete = false;
            var aborted = false;
            var statusDialog = SelectOptionsDialog.startShowing(() => complete);

            statusDialog.addEventListener('decline', () => {
                statusDialog.remove();
                aborted = true;
                resolve(false);
            });

            for (var medium of Session.mediaList.current()) {
                if (aborted) return;

                var isValid = await CleanupService.validateMediaRoot(medium.rootFolderPath);
                if (isValid) continue;
                statusDialog.addEntry(medium.id, medium.name);
            }
            complete = true;
            statusDialog.requestFullUpdate();
        });
    }

    /**
     * @returns {Promise<boolean>}
     */
    static repairMedia() {
        return new Promise(async (resolve) => {});
    }

    /**
     * @returns {Promise<boolean>}
     */
    static cleanAudioTracks() {
        return new Promise(async (resolve) => {
            var brokenTracks = (await CleanupService.getBrokenAudioTracks()).map((x) => new MusicModel(x));

            if (brokenTracks.length <= 0) {
                await DialogBase.show('Alles Ok!', {
                    content: 'Alle in Tracks in der Datenbank sind valide Audio-Dateien.',
                    declineActionText: 'Ok',
                });
                resolve(false);
                return;
            }

            var dialog = SelectOptionsDialog.show(
                brokenTracks.reduce((prev, curr) => {
                    prev[curr.hash] = curr.displayName;
                    return prev;
                }, {})
            );

            dialog.addEventListener('decline', () => {
                dialog.remove();
                resolve(false);
            });
            dialog.addEventListener('accept', async (e) => {
                try {
                    var accpeted = await DialogBase.show('Achtung!!', {
                        content:
                            'Diese Aktion wird sämtliche ausgewählten Dateien endgültig löschen.\r\n Diese Aktion kann nicht rückgägnig gemacht werden.\r\nFortfahren?',
                        acceptActionText: 'Ja',
                        declineActionText: 'Nein',
                        noImplicitAccept: true,
                    });

                    if (!accpeted) {
                        resolve(false);
                        return dialog.remove();
                    }

                    var selected = /** @type {CustomEvent<{selected: string[]}>} */ (e).detail.selected;
                    await MusicService.hardDeleteTracks(selected);
                    dialog.remove();
                    resolve(true);
                } catch (err) {
                    DialogBase.show('Bereinigung fehlgeschlagen', { content: err, declineActionText: 'Ok' });
                }
            });
        });
    }
}
