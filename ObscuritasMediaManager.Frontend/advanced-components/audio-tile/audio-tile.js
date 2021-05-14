import { InstrumentTypes } from '../../data/enumerations/instrument-types.js';
import { Instrumentation } from '../../data/enumerations/instrumentation.js';
import { Instruments } from '../../data/enumerations/instruments.js';
import { Mood } from '../../data/enumerations/mood.js';
import { Nations } from '../../data/enumerations/nations.js';
import { Participans } from '../../data/enumerations/participans.js';
import { LitElement } from '../../exports.js';
import { renderAudioTileStyles } from './audio-tile.css.js';
import { renderAudioTile } from './audio-tile.html.js';

export class AudioTile extends LitElement {
    static get styles() {
        return renderAudioTileStyles();
    }

    static get properties() {
        return {
            caption: { type: String, reflect: true },
            autor: { type: String, reflect: true },
            source: { type: String, reflect: true },
            language: { type: String, reflect: true },
            nation: { type: String, reflect: true },
            instrumentation: { type: String, reflect: true },
            participantCount: { type: String, reflect: true },
            instruments: { type: Array, reflect: true },
            instrumentTypes: { type: Array, reflect: true },
            genres: { type: Array, reflect: true },
            mood: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.caption;
        /** @type {string} */ this.autor = '';
        /** @type {string} */ this.source = '';
        /** @type {Nations} */ this.language;
        /** @type {Nations} */ this.nation;
        /** @type {Instrumentation} */ this.instrumentation;
        /** @type {Participans} */ this.participantCount;
        /** @type {Instruments[]} */ this.instruments = [];
        /** @type {InstrumentTypes[]} */ this.instrumentTypes = [];
        /** @type {string[]} */ this.genres = [];
        /** @type {Mood} */ this.mood;
    }

    get autorText() {
        if (this.autor) return `- ${this.autor}`;
        return '';
    }
    get sourceText() {
        if (this.source) return `(${this.source})`;
        return '';
    }

    render() {
        return renderAudioTile(this);
    }
}
