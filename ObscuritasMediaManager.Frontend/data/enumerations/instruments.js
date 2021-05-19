import { InstrumentTypes } from './instrument-types.js';

/**
 * @enum {{name: string, type: InstrumentTypes}}
 */
export const Instruments = {
    MaleVoice: { name: 'Male voice', type: InstrumentTypes.Vocal },
    FemaleVoice: { name: 'Female voice', type: InstrumentTypes.Vocal },
    Koto: { name: 'Koto', type: InstrumentTypes.Stringed },
    Shamisen: { name: 'Shamisen', type: InstrumentTypes.Stringed },
    Shakuhachi: { name: 'Shakuhachi', type: InstrumentTypes.WoodWind },
    Taiko: { name: 'Taiko', type: InstrumentTypes.Percussion },
};
