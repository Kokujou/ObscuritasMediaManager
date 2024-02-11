import { InteropCommand } from '../client-interop/interop-command.js';
import { MusicModel } from '../obscuritas-media-manager-backend-client.js';
import { ClientInteropService } from './client-interop-service.js';

export class ClipboardService {
    /** @param {MusicModel} track */
    static async copyAudioToClipboard(track) {
        await ClientInteropService.sendCommand({ command: InteropCommand.CopyAudioToClipboard, payload: track.path });
    }
}
