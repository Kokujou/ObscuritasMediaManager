```js script
import { html } from '@open-wc/demoing-storybook';
import { withKnobs, text, select, optionsKnob } from 'storybook-prebuilt/addon-knobs';

export default {
    title: 'AudioTile',
    component: 'audio-tile',
    options: { selectedPanel: 'storybookjs/knobs/panel' },
    decorators: [withKnobs],
};
```

# AudioTile

Repräsentiert eine Audio-Datei

## Properties:

-   **someProperty** (PropertyType): Describe all your public properties, their type and how they will affect your webcomponent

## Slots:

-   **(unnamed)**: if available, describe your defined slots and how they will displayed in the component

## Events:

-   **someEvent**: if available, describe the events triggered by your webcomponent, what data they will return and when they will be triggered

## Style parameters:

-   **--your-css-variable**: if used, describe what css variables your component exposes

## Examples:

give an example on how to implement your webcomponent. to enable our AHP styling you need to put the empty storybook-theme-tester inside the page-routing.
use available knob-functions to make properties or contents of your webcomponent configurable in the storybook

```js preview-story
import { Mood } from '../../data/enumerations/mood.js';
import { Nations } from '../../data/enumerations/nations.js';
import { Participants } from '../../data/enumerations/participants.js';
import { Instrumentation } from '../../data/enumerations/instrumentation.js';
import { Instruments } from '../../data/enumerations/instruments.js';
import { Genre } from '../../data/enumerations/genre.js';

const InstrumentEnum = {};
Object.keys(Instruments).forEach((key) => (InstrumentEnum[key] = key));

function toInstrumentList(instruments) {
    var selectedInstruments = instruments;
    return selectedInstruments.map((instrument) => Instruments[instrument]) || [];
}

export const Multiple = () => html`
    <style>
        audio-tile {
            width: 250px;
            margin: 20px;
            min-height: 250px;
        }
    </style>

    <page-routing>
        <audio-tile
            caption="Die Schafswolke"
            .mood="${select('Mood', Object.values(Mood), 'romantic')}"
            autor="olle Ko-Schnitte"
            source="My Brain"
            .genres="${optionsKnob('Genres', Genre, ['Blues', 'Soul', 'Comedy', 'Rock', 'Pop'], { display: 'multi-select' })}"
            .instruments="${toInstrumentList(optionsKnob('Instruments', InstrumentEnum, [], { display: 'multi-select' }))}"
            .language="${select('Nation', Object.values(Nations), 'japanese')}"
            .nation="${select('Language', Object.values(Nations), 'japanese')}"
            .participantCount="${select('Participants', Object.values(Participants), 'solo')}"
            .instrumentation="${select('Instrumentation', Object.values(Instrumentation), 'mixed')}"
        ></audio-tile>
    </page-routing>
`;
```
