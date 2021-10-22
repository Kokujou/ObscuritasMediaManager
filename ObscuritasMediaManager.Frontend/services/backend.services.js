import {
    CleanupClient,
    FileClient,
    GenreClient,
    MediaClient,
    MusicClient,
    PlaylistClient,
    StreamingClient,
} from '../obscuritas-media-manager-backend-client.js';

const baseUrl = '/ObscuritasMediaManager';

export const MusicService = new MusicClient(baseUrl);
export const MediaService = new MediaClient(baseUrl);
export const FileService = new FileClient(baseUrl);
export const StreamingService = new StreamingClient(baseUrl);
export const PlaylistService = new PlaylistClient(baseUrl);
export const GenreService = new GenreClient(baseUrl);
export const CleanupService = new CleanupClient(baseUrl);
