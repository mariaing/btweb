import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class AuthService {

  token: string;

  constructor(private http: Http) { }

  public EstablecerToken(token: string) {
    sessionStorage.setItem('user_token', token);
  }

  public EstablecerUser(user: Usuario) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  public IsLoggin() {
    this.token = sessionStorage.getItem('user_token');
    return (this.token !== undefined);
  }

  public ObtenerUsuario() {
    var store_user = sessionStorage.getItem('user');    
    return JSON.parse(store_user);
  }

  public ObtenerToken(): string {
    if (this.IsLoggin()) {
      return this.token;
    } else {
      return "";
    }
  }


}
