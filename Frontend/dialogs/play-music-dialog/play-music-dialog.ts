import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { waitForSeconds } from '../../extensions/animation.extension';
import { MusicModel } from '../../obscuritas-media-manager-backend-client';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { AudioService } from '../../services/audio-service';
import { renderPlayMusicDialogStyles } from './play-music-dialog.css';
import { renderPlayMusicDialog } from './play-music-dialog.html';

@customElement('play-music-dialog')
export class PlayMusicDialog extends LitElementBase {
    static instance: PlayMusicDialog | null;
    static FadeDuration = 0.5;

    static override get styles() {
        return renderPlayMusicDialogStyles();
    }

    static show(track: MusicModel, initialVolume: number, startPosition: number) {
        if (
            AudioService.paused ||
            AudioService.trackPosition.current() <= 0 ||
            location.hash == '#music' ||
            location.hash == '#music-playlist' ||
            !track?.path
        )
            return;

        if (this.instance) {
            this.instance.reinitialize(track, initialVolume, startPosition);
            return;
        }

        var dialog = new PlayMusicDialog();
        PageRouting.container!.append(dialog);
        dialog.reinitialize(track, initialVolume, startPosition);
        this.instance = dialog;

        return dialog;
    }

    currentTrack: MusicModel | null = null;

    async reinitialize(track: MusicModel, initialVolume: number, startPosition: number) {
        this.currentTrack = track;
        await AudioService.changeTrack(track?.path);
        await AudioService.changeVolume(initialVolume);
        await AudioService.changePosition(startPosition);
        await AudioService.play(track?.path);
        await this.requestFullUpdate();

        this.subscriptions.push(AudioService.trackPosition.subscribe(() => this.requestFullUpdate()));
    }

    override render() {
        return renderPlayMusicDialog.call(this);
    }

    async toggle() {
        if (!this.currentTrack) return;
        if (AudioService.paused) await AudioService.play(this.currentTrack.path);
        else await AudioService.pause();
    }

    changeTrackPosition(value: number) {
        if (AudioService.duration == Infinity) return;
        AudioService.trackPosition.next(value);
        this.requestFullUpdate();
    }

    async close() {
        this.setAttribute('closing', '');
        await this.requestFullUpdate();
        await waitForSeconds(PlayMusicDialog.FadeDuration);
        this.remove();
    }

    override async disconnectedCallback() {
        await super.disconnectedCallback();
        PlayMusicDialog.instance = null;
        await AudioService.reset();
    }
}
