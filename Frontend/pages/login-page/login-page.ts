import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { changePage } from '../../extensions/url.extension';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import { CredentialsRequest } from '../../obscuritas-media-manager-backend-client';
import { LoginService } from '../../services/backend.services';
import { WelcomePage } from '../welcome-page/welcome-page';
import { renderLoginPageStyles } from './login-page.css';
import { renderLoginPage } from './login-page.html';

@customElement('login-page')
export class LoginPage extends LitElementBase {
    static isPage = true as const;
    static pageName = 'Login';

    static override get styles() {
        return renderLoginPageStyles();
    }

    @state() protected declare username: string;
    @state() protected declare password: string;

    constructor() {
        super();
        this.username = '';
        this.password = '';
    }

    async login() {
        try {
            var request = new CredentialsRequest({ username: this.username, password: this.password });
            var token = await LoginService.login(request);
            if (!token) throw Error('bad token');
            changePage(WelcomePage);
        } catch {
            MessageSnackbar.popup('Benutzername oder Passwort sind falsch.', 'error');
        }
    }

    override render() {
        return renderLoginPage.call(this);
    }
}
