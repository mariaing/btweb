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

    const that = this;

    const authToken = this.auth.ObtenerToken();
    var auth_req = req.clone({
      setHeaders: {
        token: authToken
      }
    });        

    return next
      .handle(req)
      .do(event => {        
      }, err => {        
        switch (err.status) {
          case 504:
            this.util.showErrorTitle("Error","Servidor fuera de servicio");
            break;
          case 500:
            this.util.showError("Ocurrio un problema en el servidor.");
            break;
          case 404:
          this.util.showError("La uri no pudo ser encontrada");
            break;            
            case 409:
          this.util.showError("El objeto que desea crear no es valido, posiblemente existe el identificador");
            break;          
          default:
          this.util.showError(JSON.stringify(err));                                  
            break;
        }
      });
  }
}
