import { Injectable, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Result } from './../models/Result';

@Injectable()
export class UsuarioService {

  base = 'http://btproject.cerverodev.com/';

  constructor(private http: HttpClient, private util: UtilService, private auth: AuthService, private router: Router) { this.base = ''; }

  

  public setRoot(vcr: ViewContainerRef) {
    this.util.init(vcr);
  }

  public loggin(username: string, password: string) {
    
    this.http.post<Result<Usuario>>(this.base + 'api/usuarios/login/', {
      "Username": username,
      "Password": password
    }).subscribe(
      s => {
        if(s.IsOk){
          this.auth.EstablecerUser(s.Data);
          this.auth.EstablecerToken(s.Data.Token);
          this.util.showSuccess("Login Existoso");
          if (this.auth.IsLoggin()) {
            this.router.navigateByUrl('/dashboard');
          }
        }else{
          this.util.showErrorTitle('Error','Credenciales invalidas');
        }        
      });
  }

}
