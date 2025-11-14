import { html } from 'lit';
import { LoginPage } from './login-page';

export function renderLoginPage(this: LoginPage) {
    return html`
        <div id="page-container">
            <form id="login-form" action="javascript:void(0)" @submit="${() => this.login()}">
                <div id="username-container" class="floating-container">
                    <label for="username" ?float="${this.username.length > 0}">Benutzername</label>
                    <input
                        required
                        id="username"
                        type="text"
                        autocomplete="username"
                        oninput="javascript:this.dispatchEvent(new Event('change'))"
                        @change="${(e: Event) => (this.username = (e.target as HTMLInputElement).value)}"
                    />
                </div>

                <div id="password-container" class="floating-container">
                    <label for="password" ?float="${this.password.length > 0}">Passwort</label>
                    <input
                        required
                        id="password"
                        type="password"
                        autocomplete="current-password"
                        oninput="javascript:this.dispatchEvent(new Event('change'))"
                        @change="${(e: Event) => (this.password = (e.target as HTMLInputElement).value)}"
                    />
                </div>

                <input id="submit-button" type="submit" value="Login" />
            </form>
        </div>
    `;
}
