import { Measurement } from '../../obscuritas-media-manager-backend-client';

export const ExtendedIngredientUnit: { [key in Measurement]: string[] } = {
    Mass: ['Milligram', 'Gram', 'Kilogram'],
    Volume: ['Milliliter', 'Liter'],
    Size: ['Millimeter', 'Centimeter', 'Meter'],
    Piece: ['Piece'],
    Pinch: ['Pinch'],
    Unitless: ['Unitless'],
};
