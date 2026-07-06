import { AutoFillAnimeQueryRequest } from '../client-interop/auto-fill-anime-query-request';
import { AutoFilledAnimeResponse } from '../client-interop/auto-filled-anime-response';
import { InteropQuery } from '../client-interop/interop-query';
import { MediaCategory, MediaModel, UpdateRequestOfObject } from '../obscuritas-media-manager-backend-client';
import { MediaService } from './backend.services';
import { ClientInteropService } from './client-interop-service';

export class AnimeAutofillService {
    static async autofillAnime(anime: MediaModel) {
        var updated = await ClientInteropService.executeQuery<AutoFilledAnimeResponse>({
            query: InteropQuery.AutoFillAnime,
            payload: { isMovie: anime.type == MediaCategory.AnimeMovies, name: anime.name } as AutoFillAnimeQueryRequest,
        });

        const { oldModel, newModel } = { oldModel: {} as MediaModel, newModel: {} as MediaModel };

        if ((anime.romajiName?.length ?? 0) < 5) newModel.romajiName = updated.romajiName ?? anime.romajiName;
        if ((anime.kanjiName?.length ?? 0) < 2) newModel.kanjiName = updated.kanjiName ?? anime.kanjiName;
        if ((anime.description?.length ?? 0) < 5) newModel.description = updated.description ?? anime.description;
        if ((anime.englishName?.length ?? 0) < 5) newModel.englishName = updated.englishName ?? anime.englishName;
        if ((anime.germanName?.length ?? 0) < 5) newModel.germanName = updated.germanName ?? anime.germanName;
        if (anime.rating == null) newModel.rating = updated.rating ?? anime.rating;
        if (anime.release <= 1900) newModel.release = updated.release ?? anime.release;

        for (var key of Object.keysOf(newModel)) oldModel[key] = anime[key] as never;

        await MediaService.updateMedia(anime.id, new UpdateRequestOfObject({ oldModel, newModel }));

        if ((updated.image?.length ?? 0) > 5 && !(await MediaService.imageExists(anime.id)))
            await MediaService.addMediaImage(updated.image, anime.id);

        return updated;
    }
}
