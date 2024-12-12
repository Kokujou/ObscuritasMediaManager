import { InteropCommand } from '../client-interop/interop-command';
import { MusicModel } from '../obscuritas-media-manager-backend-client';
import { ClientInteropService } from './client-interop-service';

export class ClipboardService {
    /** @param {MusicModel} track */
    static async copyAudioToClipboard(track: MusicModel) {
        await ClientInteropService.sendCommand({ command: InteropCommand.CopyAudioToClipboard, payload: track.path });
    }
}
