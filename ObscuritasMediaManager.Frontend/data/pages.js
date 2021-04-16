export const Pages = Object.freeze({
    welcome: { route: 'welcome', component: '<welcome-page></welcome-page>' },
    animeGerSub: { route: 'anime-ger-sub', component: '<anime-ger-sub-page></anime-ger-sub-page>' },
    animeGerDub: { route: 'anime-ger-dub', component: '<anime-ger-dub-page></anime-ger-dub-page>' },
    animeMovies: { route: 'anime-movies', component: '<anime-movies-page></anime-movies-page>' },
    realSeries: { route: 'real-series', component: '<real-series-page></real-series-page>' },
    realMovies: { route: 'real-movies', component: '<real-movies-page></real-movies-page>' },
    jDrama: { route: 'j-drama', component: '<jdrama-page></jdrama-page>' },
    music: { route: 'music', component: '<music-page></music-page>' },
    games: { route: 'games', component: '<games-page></games-page>' },
});

export function getRoutes() {
    const routes = {};
    Object.values(Pages).forEach((x) => (routes[x.route] = x.component));
    return routes;
}
