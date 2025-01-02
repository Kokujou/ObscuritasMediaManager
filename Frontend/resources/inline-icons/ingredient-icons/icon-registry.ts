import { unsafeCSS } from 'lit-element';
import { IngredientCategory } from '../../../obscuritas-media-manager-backend-client';
import { renderMaskImage } from '../../../services/extensions/style.extensions';
import { miscIcon } from '../instrument-icons/misc-icon.svg';
import { breadIcon } from './bread-icon.svg';
import { condimentsIcon } from './condiments-icon.svg';
import { dairyIcon } from './dairy-icon.svg';
import { drinksIcon } from './drinks-icon.svg';
import { eggsIcon } from './eggs-icon.svg';
import { fishIcon } from './fish-icon.svg';
import { fruitsIcon } from './fruits.icon.svg';
import { meatIcon } from './meat-icon.svg';
import { noodlesIcon } from './noodles-icon.svg';
import { nutsIcon } from './nuts-icon.svg';
import { oilIcon } from './oil-icon.svg';
import { riceIcon } from './rice-icon.svg';
import { vegetablesIcon } from './vegetables-icon.svg';

export const IngredientIcons: Record<keyof typeof IngredientCategory, string> = {
    Bread: breadIcon(),
    Fish: fishIcon(),
    Fruits: fruitsIcon(),
    Meat: meatIcon(),
    Miscellaneous: miscIcon(),
    Noodles: noodlesIcon(),
    Rice: riceIcon(),
    Vegetables: vegetablesIcon(),
    Dairy: dairyIcon(),
    Eggs: eggsIcon(),
    Nuts: nutsIcon(),
    Condiments: condimentsIcon(),
    Drinks: drinksIcon(),
    Oil: oilIcon(),
};

export function registerIngredientIcons() {
    return unsafeCSS(
        Object.keys(IngredientIcons)
            .map(
                (selector: keyof typeof IngredientIcons) =>
                    `[ingredient=${selector}] {
                        ${renderMaskImage(IngredientIcons[selector])}
                    }`
            )
            .join('\n\n')
    );
}
