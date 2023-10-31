/**
 * Running tasks:
 * - Add tooltips for all icons
 * - Add Message Snackbar for all Update/Delete/Create actions
 */

//TODO: add copy-functionality also in detail page

//TODO: Audio single track creation

//TODO: Media page finalization
/**
 * - think about icons for language
 * - (re)-implement watch-functionality, export anime as playlist (local is enough because global is impossible either way)
 */

//TODO: (optional) create templates for edit - might be a bit late... also mainstream is usually < 3*
//TODO: implement loading-indiciation for requests - does that really make sense? the API is quite performant

//TODO: improve re-upload algorithm to not overwrite or duplicate data (media-pages)
/**
 * - new series should be added
 * - new seasons + episodes to existing seasons should be added
 * - be sensitive to change in folder structure e.g. no seasons -> s1 + s2
 * - maybe display results in table form to emergency-edit if required
 */

//TODO: Change cleanup functionality for audio
/**
 * - introduce modes (simple vs extended)
 * - cleanup should become a mode toggle
 * - when toggling, list all "broken" tracks depending on your cleanup mode
 * - now the user can also "fix" tracks like change the file path or delete
 */

//TODO: think a proper concept about when to spawn/close the play-music-dialog, it's getting ridiculous
//TODO: Websockets
//TODO: remove all mentionings of renderMaskImage and replace with iconRegistry
//TODO: add created at/updated at
//TODO: fix next track playing if not finished loading
//TODO: add text to language switcher to indicate whether you're changing nation/language
//TODO: fix broken language icon in music page
//TODO: refactor the route-system
//TODO: refactor the update-system
//TODO: think about removing nations. probably doesn't make sense and/or is already reflected in the genre-list

/**
 * TODO: RECIPE DATABASE
 * - start with create-functionality
 * - upload photos/slideshow from google photos, link or img
 * - add a scaling feature for portions
 * - add a calculation feature for units
 * - categories:
 *      nation,
 *      course (main, desert, soup, side, salat),
 *      main ingredient: noodles, meat, fish, rice, bread, ...
 * - important properties: time (to prepare, to cook, total), difficulty, rating, genres?, tags?
 *      - tagging system to create new tags
 *
 */
