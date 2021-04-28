/** @type {{[key: string]: RouteDefinition}} */
export const Pages = {
    welcome: { routes: ['welcome'], component: '<welcome-page></welcome-page>', withQueries: [] },
    mediaDetail: {
        routes: ['anime-ger-sub', 'anime-ger-dub', 'anime-movies', 'real-series', 'real-movies', 'j-drama'],
        component: '<media-detail-page></media-detail-page>',
        withQueries: ['name', 'type'],
    },
    animeGerSub: { routes: ['anime-ger-sub'], component: '<anime-ger-sub-page></anime-ger-sub-page>', withQueries: [] },
    animeGerDub: { routes: ['anime-ger-dub'], component: '<anime-ger-dub-page></anime-ger-dub-page>', withQueries: [] },
    animeMovies: { routes: ['anime-movies'], component: '<anime-movies-page></anime-movies-page>', withQueries: [] },
    realSeries: { routes: ['real-series'], component: '<real-series-page></real-series-page>', withQueries: [] },
    realMovies: { routes: ['real-movies'], component: '<real-movies-page></real-movies-page>', withQueries: [] },
    jDrama: { routes: ['j-drama'], component: '<jdrama-page></jdrama-page>', withQueries: [] },
    music: { routes: ['music'], component: '<music-page></music-page>', withQueries: [] },
    games: { routes: ['games'], component: '<games-page></games-page>', withQueries: [] },
    video: {
        routes: ['video'],
        component: '<video-player-popup></video-player-popup>',
        withQueries: ['name', 'type', 'season', 'episode'],
    },
};

export class RouteDefinition {
    /** @type {string[]} */ routes;
    /** @type {string} */ component;
    /** @type {string[]} */ withQueries;
}
