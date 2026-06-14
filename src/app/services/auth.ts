import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'bite',
    clientId: 'bite-client',
  });

  private initPromise?: Promise<boolean>;

  initialized = signal(false);
  authenticated = signal(false);
  userName = signal('');

  init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then(authenticated => {
        this.authenticated.set(authenticated);
        this.initialized.set(true);

        if (authenticated) {
          this.setUserName();
        }

        return authenticated;
      })
      .catch(() => {
        this.authenticated.set(false);
        this.initialized.set(true);
        return false;
      });

    return this.initPromise;
  }

  isAuthenticated() {
    return this.authenticated();
  }

  login(redirectUri = `${window.location.origin}/admin`) {
    return this.keycloak.login({
      redirectUri,
    });
  }

  logout() {
    return this.keycloak.logout({
      redirectUri: `${window.location.origin}/restaurants`,
    });
  }

  private setUserName() {
    const token = this.keycloak.tokenParsed as
      | {
          preferred_username?: string;
          name?: string;
        }
      | undefined;

    this.userName.set(token?.preferred_username ?? token?.name ?? 'Restaurant');
  }
}