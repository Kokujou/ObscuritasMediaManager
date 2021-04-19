/** @type {{[key: string]: RouteDefinition}} */
export const Pages = Object.freeze({
    welcome: { route: 'welcome', component: '<welcome-page></welcome-page>', allowedQueries: [] },
    animeGerSub: { route: 'anime-ger-sub', component: '<anime-ger-sub-page></anime-ger-sub-page>', allowedQueries: ['name'] },
    animeGerDub: { route: 'anime-ger-dub', component: '<anime-ger-dub-page></anime-ger-dub-page>', allowedQueries: [] },
    animeMovies: { route: 'anime-movies', component: '<anime-movies-page></anime-movies-page>', allowedQueries: [] },
    realSeries: { route: 'real-series', component: '<real-series-page></real-series-page>', allowedQueries: [] },
    realMovies: { route: 'real-movies', component: '<real-movies-page></real-movies-page>', allowedQueries: [] },
    jDrama: { route: 'j-drama', component: '<jdrama-page></jdrama-page>', allowedQueries: [] },
    music: { route: 'music', component: '<music-page></music-page>', allowedQueries: [] },
    games: { route: 'games', component: '<games-page></games-page>', allowedQueries: [] },
});

export class RouteDefinition {
    /** @type {string} */ route;
    /** @type {string} */ component;
    /** @type {string[]} */ allowedQueries;
}
