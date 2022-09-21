import { Component } from '@angular/core';
import { KeycloakService, KeycloakEventType } from 'keycloak-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  unsubscriber = new Subject<void>();

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit() {
    this.keycloakService.keycloakEvents$
      .pipe(takeUntil(this.unsubscriber))
      .subscribe({
        next: (e) => {
          if (e.type === KeycloakEventType.OnTokenExpired) {
            this.keycloakService
              .updateToken()
              .then((refreshed) => {
                if (refreshed) {
                  console.debug(
                    `Token was successfully refreshed (${new Date()})`
                  );
                } else {
                  console.debug('Token is still valid');
                }
              })
              .catch(() => {
                console.error(
                  `Failed to refresh the token, or the session has expired (${new Date()})`
                );
              });
          }

          if (e.type === KeycloakEventType.OnAuthLogout) {
            this.keycloakService.logout();
          }
        },
      });
  }

  ngOnDestroy() {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
