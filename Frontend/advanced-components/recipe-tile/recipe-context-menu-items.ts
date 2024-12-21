import { Session } from '../../data/session';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base';
import { ContextMenuItem } from '../../native-components/context-menu/context-menu';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import { RecipeService } from '../../services/backend.services';
import { RecipeTile } from './recipe-tile';

export function getRecipeTileContextMenuItems(this: RecipeTile) {
    const items: ContextMenuItem[] = [];

    const recycleRecipe: ContextMenuItem = {
        text: 'In Papierkorb verschieben',
        icon: 'Trash',
        action: async () => {
            try {
                await RecipeService.softDeleteRecipe(this.recipe.id!);
                await MessageSnackbar.popup('Rezept erfolgreich gelöscht.', 'success');
                Session.recipes.next(await RecipeService.getAllRecipes());
            } catch (err) {
                console.error(err);
                await MessageSnackbar.popup('Ein Fehler ist beim Löschen des Rezepts aufgetreten: ' + err, 'error');
            }
        },
    };

    const restoreRecipe: ContextMenuItem = {
        text: 'Wiederherstellen',
        icon: 'Revert',
        action: async () => {
            try {
                await RecipeService.undeleteRecipe(this.recipe.id!);
                await MessageSnackbar.popup('Rezept erfolgreich wiederhergestellt.', 'success');
                Session.recipes.next(await RecipeService.getAllRecipes());
            } catch (err) {
                console.error(err);
                await MessageSnackbar.popup('Ein Fehler ist beim Wiederherstellen des Rezepts aufgetreten: ' + err, 'error');
            }
        },
    };

    const deleteRecipe: ContextMenuItem = {
        text: 'Endgültig löschen',
        icon: 'Trash',
        action: async () => {
            try {
                await DialogBase.show('Bist du sicher?', {
                    content:
                        'Du bist dabei das Rezept für immer zu löschen.\n Dies kann nicht rückgängig gemacht werden!\nBist du sicher?',
                    acceptActionText: 'Ja',
                    declineActionText: 'Nein',
                    noImplicitAccept: true,
                });
                await RecipeService.softDeleteRecipe(this.recipe.id!);
                await MessageSnackbar.popup('Rezept erfolgreich gelöscht.', 'success');
                Session.recipes.next(await RecipeService.getAllRecipes());
            } catch (err) {
                console.error(err);
                await MessageSnackbar.popup('Ein Fehler ist beim Löschen des Rezepts aufgetreten: ' + err, 'error');
            }
        },
    };

    if (!this.recipe.deleted) items.push(recycleRecipe);
    else items.push(restoreRecipe, deleteRecipe);

    return items;
}
