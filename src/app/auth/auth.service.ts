import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface Token {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface User {
  //https://www.keycloak.org/docs-api/11.0/rest-api/#_userrepresentation
  id?: string;
  username?: string;
  enabled?: boolean;
  totp?: boolean;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  disableableCredentialTypes?: string[];
  requiredActions?: string[];
  notBefore?: number;
  access?: any;
}

export interface Group {
  //https://www.keycloak.org/docs-api/11.0/rest-api/#_grouprepresentation
  access?: any;
  attributes?: any;
  clientRoles?: any;
  id?: string;
  name?: string;
  path?: string;
  realmRoles?: string[];
  subGroups?: Group[];
}

export interface Client {
  //https://www.keycloak.org/docs-api/11.0/rest-api/#_clientrepresentation
  access?: any;
  adminUrl?: string;
  alwaysDisplayInConsole?: boolean;
  attributes?: any;
  authenticationFlowBindingOverrides?: any;
  authorizationServicesEnabled?: boolean;
  authorizationSettings?: any;
  baseUrl?: string;
  bearerOnly?: boolean;
  clientAuthenticatorType?: string;
  clientId?: string;
  consentRequired?: boolean;
  defaultClientScopes?: string[];
  defaultRoles?: string[];
  description?: string;
  directAccessGrantsEnabled?: boolean;
  enabled?: boolean;
  frontchannelLogout?: boolean;
  fullScopeAllowed?: boolean;
  id?: string;
  implicitFlowEnabled?: boolean;
  name?: string;
  nodeReRegistrationTimeout?: number;
  notBefore?: number;
  optionalClientScopes?: string[];
  origin?: string;
  protocol?: string;
  protocolMappers?: any[];
  publicClient?: boolean;
  redirectUris?: string[];
  registeredNodes?: any;
  registrationAccessToken?: string;
  rootUrl?: string;
  secret?: string;
  serviceAccountsEnabled?: boolean;
  standardFlowEnabled?: boolean;
  surrogateAuthRequired?: boolean;
  webOrigins?: string[];
}

const ADMIN_API_PATH = '/auth/admin/realms';
const ADMIN_API_WITH_REALM = `${ADMIN_API_PATH}/${environment.keycloak.realm}`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  changePassword(data: { userId: string; newPassword: string }) {
    return this.http.put<null>(
      `${ADMIN_API_WITH_REALM}/users/${data.userId}/reset-password/`,
      { type: 'password', temporary: false, value: data.newPassword }
    );
  }

  getUser(user: string) {
    const params = new HttpParams();
    params.set('username', user);

    return this.http
      .get<User[]>(`${ADMIN_API_WITH_REALM}/users/`, {
        params,
      })
      .pipe(map((users) => users[0]));
  }

  getUsers() {
    return this.http.get<User[]>(`${ADMIN_API_WITH_REALM}/users/`);
  }

  getUserGroups(userId: string) {
    return this.http.get<Group[]>(
      `${ADMIN_API_WITH_REALM}/users/${userId}/groups`
    );
  }

  getGroups() {
    return this.http.get<Group[]>(`${ADMIN_API_WITH_REALM}/groups/`);
  }

  getGroupMembers(groupId: string) {
    return this.http.get<User[]>(
      `${ADMIN_API_WITH_REALM}/groups/${groupId}/members`
    );
  }

  getClients() {
    return this.http.get<Client[]>(`${ADMIN_API_WITH_REALM}/clients/`);
  }

  createUser(data: {
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    groups?: string[];
    credentials: { type: 'password'; value: string }[];
  }) {
    return this.http.post<any>(
      `${ADMIN_API_WITH_REALM}/users`,
      Object.assign(data, { enabled: true })
    );
  }

  removeUser(userId: string) {
    return this.http.delete<any>(`${ADMIN_API_WITH_REALM}/users/${userId}`);
  }
}
