import { html } from '../../exports.js';
import { MediaDetailPage } from './media-detail-page.js';

/**
 * @param {MediaDetailPage} detailPage
 */
export function renderMediaDetailPage(detailPage) {
    return html`
        <style>
            .media-image {
                background-image: url(${detailPage.media.image});
            }
        </style>

        <page-layout>
            <div class="media-detail-container">
                <div class="content-panels">
                    <div class="left-panel">
                        <div class="media-image"></div>
                        <div class="media-rating"></div>
                        <div class="media-warnings"></div>
                    </div>
                    <div class="right panel">
                        <div class="media-heading">${detailPage.media.name}</div>
                        <div class="property-entry">
                            <div class="property-name">Genres:</div>
                            <div class="property-value">${detailPage.media.genreString}</div>
                        </div>
                        <div class="property-entry">
                            <div class="property-name">Release:</div>
                            <div class="property-value">${detailPage.media.release}</div>
                        </div>
                        <div class="property-entry">
                            <div class="property-name">Beschreibung:</div>
                            <div class="property-value">${detailPage.media.description}</div>
                        </div>
                    </div>
                </div>
            </div>
        </page-layout>
    `;
}
