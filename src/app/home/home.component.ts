import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title = 'angular-for-test';

  constructor(private keycloakService: KeycloakService) {}

  onRequestToBackend() {

  }

  onLogout() {
    this.keycloakService.logout();
  }
}
