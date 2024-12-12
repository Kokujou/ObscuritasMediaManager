import { Measurement } from '../../obscuritas-media-manager-backend-client';

/** @type { {[key in Measurement] : string[]} }  */
export const ExtendedIngredientUnit = {
    Mass: ['Milligram', 'Gram', 'Kilogram'],
    Volume: ['Milliliter', 'Liter'],
    Size: ['Millimeter', 'Centimeter', 'Meter'],
    Piece: ['Piece'],
    Pinch: ['Pinch'],
    Unitless: ['Unitless'],
};
