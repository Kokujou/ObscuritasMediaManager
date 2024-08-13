import {
    CleanupClient,
    FileClient,
    GenreClient,
    InteropProxyClient,
    LoginClient,
    MediaClient,
    MusicClient,
    PlaylistClient,
    RecipeClient,
} from '../obscuritas-media-manager-backend-client.js';
import { AuthenticatedRequestService } from './authenticated-request.service.js';
import { ClientInteropService } from './client-interop-service.js';

const baseUrl = 'Backend';

var authenticatedRequestService = new AuthenticatedRequestService();
export const MusicService = new MusicClient(baseUrl, authenticatedRequestService);
export const MediaService = new MediaClient(baseUrl, authenticatedRequestService);
export const FileService = new FileClient(baseUrl, authenticatedRequestService);
export const PlaylistService = new PlaylistClient(baseUrl, authenticatedRequestService);
export const GenreService = new GenreClient(baseUrl, authenticatedRequestService);
export const CleanupService = new CleanupClient(baseUrl, authenticatedRequestService);
export const LoginService = new LoginClient(baseUrl, authenticatedRequestService);
export const RecipeService = new RecipeClient(baseUrl, authenticatedRequestService);
export const InteropProxyService = new InteropProxyClient(baseUrl, authenticatedRequestService);
ClientInteropService.startConnection();
