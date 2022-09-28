import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title = 'angular-for-test';

  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient
  ) {}

  onRequestToBackend() {
    this.http.get<any>('http://localhost/diesel/service/public').subscribe((res) => {
      console.log(res);
    });
  }

  onRequestToBackendUserRole() {
    this.http.get<any>('http://localhost/diesel/service/secured').subscribe((res) => {
      console.log(res);
    });
  }

  onRequestToBackendAdminRole() {
    this.http.get<any>('http://localhost/diesel/service/admin').subscribe((res) => {
      console.log(res);
    });
  }

  onLogout() {
    this.keycloakService.logout();
  }
}
