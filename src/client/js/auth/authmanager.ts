// import { Auth0DecodedHash, Auth0Error, Auth0ParseHashError, Auth0UserProfile, WebAuth } from 'auth0-js';
import { Auth0DecodedHash, Auth0Error, Auth0ParseHashError, Auth0UserProfile } from 'auth0-js';
// import { Config } from '../common/config';

interface SessionInfo {
  userId: string,
  nickname: string,
  pictureUrl: string
}

export class AuthManager {
  private logInButtonElement_: HTMLElement;
  private logOutButtonElement_: HTMLElement;
  private helloElement_: HTMLElement;
  private pictureElement_: HTMLImageElement;
  // private auth_: WebAuth;
  private sessionInfo_: SessionInfo | null;

  constructor(
      logInButtonElement: HTMLElement,
      logOutButtonElement: HTMLElement,
      helloElement: HTMLElement,
      pictureElement: HTMLImageElement) {
    this.logInButtonElement_ = logInButtonElement;
    this.logOutButtonElement_ = logOutButtonElement;
    this.helloElement_ = helloElement;
    this.pictureElement_ = pictureElement;

    // this.auth_ = new WebAuth({
    //   domain: Config.AUTH0_DOMAIN,
    //   clientID: Config.AUTH0_CLIENT_ID,
    //   audience: Config.AUTH0_AUDIENCE,
    //   redirectUri: location.href,
    //   responseType: 'token id_token',
    //   scope: 'openid profile read:repertoires write:repertoires',
    //   leeway: 60
    // });

    this.logInButtonElement_.onclick = this.logIn_.bind(this);
    this.logOutButtonElement_.onclick = this.logOut_.bind(this);
    this.sessionInfo_ = null;
  }

  getAccessToken(): string | null {
    // if (!localStorage.getItem('expires_at')) {
    //   return null;
    // }

    // const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '0');
    // if (expiresAt < new Date().getTime()) {
    //   console.log('Ignored stale access token.');
    //   return null;
    // }
    return localStorage.getItem('access_token') || null;
  }

  getSessionInfo(): SessionInfo | null {
    return this.sessionInfo_;
  }

  detectSession(): Promise<boolean> {
    return new Promise(
        function(this: AuthManager, resolve: Function, reject: Function) {
          if (window.location.hash) {
            // this.auth_.parseHash(
            //     this.handleAuthResult_.bind(this, resolve, reject));
            // this.handleAuthResult_.bind(this, resolve, reject)
            // this.handleAuthResult_(new Promise(() => true) as any, null as any, null, null)
            this.handleAuthResult_(() => true as any, null as any, null, null)
            return;
          }

          const accessToken = this.getAccessToken();
          if (!accessToken) {
            resolve(false);
            this.showLogInButton_();
            return;
          }
          this.handleUserProfile_(resolve, null as any, null, null as any)
          // this.auth_.client.userInfo(
          //     accessToken, this.handleUserProfile_.bind(this, resolve, reject));
        }.bind(this));
  }

  private handleAuthResult_(
      resolve: Function,
      reject: Function,
      err: Auth0ParseHashError | null,
      authResult: Auth0DecodedHash | null): void {
    window.location.hash = '';
    // if (authResult && authResult.accessToken) {
      this.setSession_(null as any);
      this.handleUserProfile_(resolve, null as any, null, null as any)
      // this.auth_.client.userInfo(
      //     authResult.accessToken,
      //     this.handleUserProfile_.bind(this, resolve, reject));
    // } else {
    //   if (err) {
    //     reject(err);
    //     return;
    //   }
    //   this.showLogInButton_();
    //   resolve(false);
    // }
  }

  private handleUserProfile_(
      resolve: Function,
      reject: Function,
      err: Auth0Error | null,
      profile: Auth0UserProfile): void {
    // if (err) {
    //   this.showLogInButton_();
    //   reject(err);
    //   return;
    // }
    this.sessionInfo_ = {
      // userId: profile.sub,
      userId: "Zinggi_id",
      // nickname: profile.nickname,
      nickname: "Zinggi",
      // pictureUrl: profile.picture
      pictureUrl: ""
    };
    this.showLoggedInUser_();
    resolve(true);
  }

  private logIn_(): void {
    // this.auth_.authorize();
    // this.sessionInfo_ = {
    //   // userId: profile.sub,
    //   userId: "Zinggi_id",
    //   // nickname: profile.nickname,
    //   nickname: "Zinggi",
    //   // pictureUrl: profile.picture
    //   pictureUrl: ""
    // };
    // this.showLoggedInUser_();
    (window as any).location = `${location.href}#login`;
    this.handleAuthResult_(() => true as any, null as any, null, null)
    window.location.reload();
  }

  private logOut_(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    // localStorage.removeItem('expires_at');
    // Redirect to the auth0 logout page.
    // this.auth_.logout({
    //   returnTo: location.href,
    //   clientID: Config.AUTH0_CLIENT_ID
    // });
    (window as any).location = location.href;
    window.location.reload();
  }

  private showLogInButton_(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    // localStorage.removeItem('expires_at');
    this.logInButtonElement_.classList.toggle('hidden', false);
    this.logOutButtonElement_.classList.toggle('hidden', true);
    this.helloElement_.classList.toggle('hidden', true);
    this.pictureElement_.classList.toggle('hidden', true);
  }

  private showLoggedInUser_(): void {
    if (!this.sessionInfo_) {
      throw new Error('There is no logged in user.');
    }
    this.logInButtonElement_.classList.toggle('hidden', true);
    this.logOutButtonElement_.classList.toggle('hidden', false);
    this.helloElement_.classList.toggle('hidden', false);
    this.pictureElement_.classList.toggle('hidden', false);
    this.helloElement_.innerText = 'Hi, '
        + (this.sessionInfo_.nickname || 'anonymous') + '!';
    this.pictureElement_.src = this.sessionInfo_.pictureUrl;
  }

  private setSession_(authResult: Auth0DecodedHash): void {
    // if (authResult
    //     && authResult.accessToken
    //     && authResult.idToken
    //     && authResult.expiresIn) {
      // const expiresAt = JSON.stringify(
      //     authResult.expiresIn * 1000 + new Date().getTime());
      localStorage.setItem('access_token', "token");
      localStorage.setItem('id_token', "Zinggi_id");
    //   localStorage.setItem('expires_at', expiresAt);
    //   this.scheduleRenewal_();
    // }
  }

  // private scheduleRenewal_() {
  //   const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '0');
  //   const delay = expiresAt - Date.now();
  //   if (delay > 0) {
  //     setTimeout(function(this: AuthManager) {
  //       this.auth_.checkSession({}, (err, result) => {
  //         if (!err && result) {
  //           console.log('Auth refreshed.');
  //           this.setSession_(result);
  //         }
  //       });
  //     }.bind(this), delay);
  //   }
  // }
}
