import { html } from '../../exports.js';
import { LoginPage } from './login-page.js';

/**
 * @param { LoginPage } loginPage
 */
export function renderLoginPage(loginPage) {
    return html`
        <div id="page-container">
            <form id="login-form" action="javascript:void(0)" @submit="${() => loginPage.login()}">
                <div id="username-container" class="floating-container">
                    <label for="username" ?float="${loginPage.username.length > 0}">Benutzername</label>
                    <input
                        required
                        id="username"
                        type="text"
                        autocomplete="username"
                        oninput="javascript:this.dispatchEvent(new Event('change'))"
                        @change="${(e) => (loginPage.username = e.target.value)}"
                    />
                </div>

                <div id="password-container" class="floating-container">
                    <label for="password" ?float="${loginPage.password.length > 0}">Passwort</label>
                    <input
                        required
                        id="password"
                        type="password"
                        autocomplete="current-password"
                        oninput="javascript:this.dispatchEvent(new Event('change'))"
                        @change="${(e) => (loginPage.password = e.target.value)}"
                    />
                </div>

                <input id="submit-button" type="submit" value="Login" />
            </form>
        </div>
    `;
}
