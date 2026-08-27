import { Session } from '../data/session';
import { IndexedDbService } from '../services/indexed-db.service';
import { AudioService } from './audio.service';
import { OfflineMusicCache } from './offline-music.cache';
import { OfflineMusicDetailsPage } from './offline-music-details-page/offline-music-details-page';
import { OfflineMusicImportPage } from './offline-music-import-page/offline-music-import-page';
import { OfflineMusicPage } from './offline-music-page/offline-music-page';
import { SessionRecorder } from './session-recorder';
import { OfflineSession } from './session';

(window as any).__omm = {
    Session,
    OfflineSession,
    SessionRecorder,
    OfflineMusicCache,
    IndexedDbService,
    AudioService,
    OfflineMusicPage,
    OfflineMusicDetailsPage,
    OfflineMusicImportPage,
};
