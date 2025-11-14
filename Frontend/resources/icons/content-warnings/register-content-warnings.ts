import { unsafeCSS } from 'lit';
import { ContentWarning } from '../../../obscuritas-media-manager-backend-client';

/**
 * @description Will load the specified resource as background-image (no-mask), uses the attribute "content-warning"
 */
export function registerContentWarnings() {
    return unsafeCSS(
        Object.values(ContentWarning)
            .map(
                (warning) => `
                        *[content-warning='${warning}'] {
                            mask: url('${getContentWarningIconPath(warning)}') 100% 100% / 100% 100%;
                            -webkit-mask: url('${getContentWarningIconPath(warning)}') 100% 100% / 100% 100%;
                        }
                    `
            )
            .join('')
    );
}

function getContentWarningIconPath(warning: ContentWarning) {
    switch (warning) {
        case ContentWarning.Violence:
            return './resources/icons/content-warnings/conflict.png';
        case ContentWarning.Sexuality:
            return './resources/icons/content-warnings/sex.png';
        case ContentWarning.Gore:
            return './resources/icons/content-warnings/gore.png';
        case ContentWarning.Horror:
            return './resources/icons/content-warnings/horror.png';
        case ContentWarning.Vulgarity:
            return './resources/icons/content-warnings/swearing.png';
        case ContentWarning.Drugs:
            return './resources/icons/content-warnings/drugs.png';
        case ContentWarning.Depression:
            return './resources/icons/content-warnings/depression.png';
    }
}
