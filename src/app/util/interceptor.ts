import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../services/auth.service";
import 'rxjs/add/operator/do';
import { UtilService } from './../services/util.service';

@Injectable()
export class BTInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private util : UtilService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.auth.ObtenerToken();
    var auth_req = req.clone({
      setHeaders: {
        token: authToken
      }
    });

    return next
      .handle(req)
      .do(event => {
        if (event instanceof HttpResponse) {
                    
        }
      }, err => {
        switch (err.status) {
          case 504:
            this.util.showErrorTitle("Error","servidor fuera de servicio");            
            break;
          case 500:
            this.util.showError("ocurrio un problema en el servidor.");            
            break;
          case 404:
            console.log("la uri no pudo ser encontrada");
            break;
          default:
            break;
        }
        if (err.status === 500) {

        }
      });
  }
}
