import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BsModalModule } from "ng2-bs3-modal";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./views/login/login.component";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { HttpModule } from "@angular/http";

import { UsuarioService } from './services/usuario.service';
import { UtilService } from './services/util.service';
import { AuthService } from "./services/auth.service";
import { MenuService } from "./services/menu.services";

import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BTInterceptor } from "./util/interceptor";
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AsignacionComponent } from './views/menus/asignacion/asignacion.component';
import { EmpresasComponent } from './views/menus/empresas/empresas.component';
import { EmpleadosComponent } from './views/menus/empleados/empleados.component';
import { ConsultasComponent } from './views/menus/consultas/consultas.component';
import { EmpresasService } from "./services/empresas.service";
import { MapService } from './services/map.service';
import { GmapComponent } from './views/controls/gmap/gmap.component';
/*
############################################################
##                        route
############################################################
 */

const appRoutes: Routes = [

  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  {
    path: "dashboard", component: DashboardComponent,
    children: [
      { path: "empresas", component: EmpresasComponent },
      { path: "empleados", component: EmpleadosComponent },
      { path: "asignacion", component: AsignacionComponent },
      { path: "consultas", component: ConsultasComponent }
    ]
  }

]

@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent, AsignacionComponent, EmpresasComponent, EmpleadosComponent, ConsultasComponent, GmapComponent],
  imports: [  
  HttpClientModule,
    HttpModule,
    BrowserModule,
    FormsModule,
    BsModalModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    ToastModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BTInterceptor, multi: true },
    AuthService,
    UsuarioService,
    UtilService,
    MenuService,
    EmpresasService,
    MapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
