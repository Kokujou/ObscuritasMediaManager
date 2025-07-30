import { FoodTagModel, IngredientCategory, Language } from '../../obscuritas-media-manager-backend-client';
import { CookingTechnique } from './cooking-technique';
import { Course } from './course';
import { FoodCategory } from './foot-category';

declare module '../../obscuritas-media-manager-backend-client' {
    interface FoodTagModel {
        color: string;

        withColor(color: string): FoodTagModel;
    }
}

FoodTagModel.prototype.withColor = function (this: FoodTagModel, color: string) {
    this.color = color;
    return this;
};

export const ColoredFoodTags: FoodTagModel[] = [
    ...Object.keys(IngredientCategory).map((x) => new FoodTagModel({ key: 'Zutat' as const, value: x }).withColor('#590')),
    ...Object.keys(Language).map((x) => new FoodTagModel({ key: 'Nationalität', value: x }).withColor('#950')),
    ...Object.keys(Course).map((x) => new FoodTagModel({ key: 'Gang', value: x }).withColor('#099')),
    ...Object.keys(CookingTechnique).map((x) => new FoodTagModel({ key: 'Zubereitungsart', value: x }).withColor('#990')),
    ...Object.keys(FoodCategory).map((x) => new FoodTagModel({ key: 'Kategorie', value: x }).withColor('#059')),
];
