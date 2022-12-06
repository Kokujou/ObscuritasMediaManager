import { LitElement } from '../../exports.js';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar.js';
import { CredentialsRequest } from '../../obscuritas-media-manager-backend-client.js';
import { AuthenticatedRequestService } from '../../services/authenticated-request.service.js';
import { LoginService } from '../../services/backend.services.js';
import { changePage } from '../../services/extensions/url.extension.js';
import { renderLoginPageStyles } from './login-page.css.js';
import { renderLoginPage } from './login-page.html.js';

export class LoginPage extends LitElement {
    static get styles() {
        return renderLoginPageStyles();
    }

    static get properties() {
        return { username: { type: String, reflect: false }, password: { type: String, reflect: false } };
    }

    constructor() {
        super();
        document.title = 'Login';

        this.username = '';
        this.password = '';
    }

    async login() {
        try {
            var ticket = await LoginService.login(new CredentialsRequest({ username: this.username, password: this.password }));
            localStorage.setItem(AuthenticatedRequestService.AuthHeaderStorageKey, ticket);
            changePage('welcome');
        } catch {
            MessageSnackbar.popup('Benutzername oder Passwort sind falsch.', 'error');
        }
    }

    render() {
        return renderLoginPage(this);
    }
}
