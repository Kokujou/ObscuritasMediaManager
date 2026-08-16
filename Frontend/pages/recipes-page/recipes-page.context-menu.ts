import { ContextMenuItem } from '../../native-components/context-menu/context-menu';
import { RecipeModel } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { RecipesPage } from './recipes-page';

export function getRecipesPageContextMenu(this: RecipesPage, recipe: RecipeModel) {
    let items = [] as ContextMenuItem[];

    if (recipe.deleted)
        items.push(
            {
                text: 'Wiederherstellen',
                icon: Icons.Revert,
                action: async () => this.undeleteRecipe(recipe.id!),
            },
            {
                text: 'Endgültig löschen',
                icon: Icons.Trash,
                action: async () => this.hardDeleteRecipe(recipe.id!),
            },
        );
    else
        items.push({
            text: 'Löschen',
            icon: Icons.Trash,
            action: async () => this.softDeleteRecipe(recipe.id!),
        });

    return items;
}
