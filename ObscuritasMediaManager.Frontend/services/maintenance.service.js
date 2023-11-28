import { Session } from '../data/session.js';
import { DialogBase } from '../dialogs/dialog-base/dialog-base.js';
import { SelectOptionsDialog } from '../dialogs/select-options-dialog/select-options-dialog.js';
import { LinkElement } from '../native-components/link-element/link-element.js';
import { MessageSnackbar } from '../native-components/message-snackbar/message-snackbar.js';
import { MusicModel } from '../obscuritas-media-manager-backend-client.js';
import { MediaDetailPage } from '../pages/media-detail-page/media-detail-page.js';
import { CleanupService, MediaService, MusicService } from './backend.services.js';

export class MaintenanceService {
    /**
     * @returns {Promise<boolean>}
     */
    static cleanMedia() {
        return new Promise(async (resolve) => {
            var complete = false;
            var aborted = false;
            var selectionDialog = SelectOptionsDialog.startShowing(() => complete);

            selectionDialog.addEventListener('decline', () => {
                selectionDialog.remove();
                aborted = true;
                resolve(false);
            });

            for (var medium of Session.mediaList.current()) {
                if (aborted) return;

                var isValid = await CleanupService.validateMediaRoot(medium.rootFolderPath);
                if (isValid) continue;
                selectionDialog.addEntry(medium.id, LinkElement.forPage(MediaDetailPage, { mediaId: medium.id }, medium.name));
            }
            complete = true;

            selectionDialog.addEventListener(
                'accept',
                /** @param {CustomEvent<{selected:string[]}>} e */ async (e) => {
                    var accepted = await DialogBase.show('Achtung!', {
                        content: `Die ausgewählten Einträge werden vollständig sowohl aus der Datenbank als auch vom Dateisystem entfernt. 
                        Dieser Vorgang kann nicht rückgängig gemacht werden. 
                        ind Sie sicher?`,
                        acceptActionText: 'Ja',
                        declineActionText: 'Nein',
                        noImplicitAccept: true,
                        showBorder: true,
                    });

                    if (!accepted) return;

                    var errors = 0;
                    for (var mediaId of e.detail.selected)
                        try {
                            await MediaService.fullDeleteMedium(mediaId);
                        } catch (err) {
                            errors++;
                        }

                    selectionDialog.remove();
                    if (errors == 0) MessageSnackbar.popup('Alle Einträge worden erfolgreich gelöscht', 'success');
                    else MessageSnackbar.popup('Ein Fehler ist beim Löschen der Einträge aufgetreten.', 'error');
                }
            );

            selectionDialog.requestFullUpdate();
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
