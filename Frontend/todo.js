/**
 * Running tasks:
 * - Add tooltips for all icons
 * - Add Message Snackbar for all Update/Delete/Create actions
 */

//TODO: Media page finalization
/**
 * - think about icons for language
 * - export anime as playlist (local is enough because global is impossible either way)
 * - finalize cleanup functionality
 * - create a link between media and audio (show related songs -> navigate to source)
 * - think about a "tempo" property for songs or re-evanluate existing "calm" classification
 * - creating track does not redirct
 * - no feedback on creating track or saving lyrics
 * - enrich media data with:
 *      - episode count
 *      - open ending?
 *      - dual language? (1. season ger, 2. season jap)
 *      - multilingual titles
 */

//TODO: bug: when starting TRACK A in media detail page of track B, it's not overwritten even when re-starting
//TODO: think about solution - computed backend properties will not be changed when base properties change
//TODO: (optional) create templates for edit - might be a bit late... also mainstream is usually < 3*
//TODO: implement loading-indiciation for requests - does that really make sense? the API is quite performant
//TODO: think about creating an UDP channel for visualization stuff, as this stuff might require a different lossful handing

//TODO: Change cleanup functionality for audio
/**
 * - introduce modes (simple vs extended)
 * - cleanup should become a mode toggle
 * - when toggling, list all "broken" tracks depending on your cleanup mode
 * - now the user can also "fix" tracks like change the file path or delete
 */

//TODO: Websockets (probably low priority as it's only one user, so a simultanous UI-Update is enough)
//TODO: add created at/updated at ?

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
 */
