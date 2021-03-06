import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BsModalModule } from 'ng2-bs3-modal';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { HttpModule } from '@angular/http';

import { UsuarioService } from './services/usuario.service';
import { UtilService } from './services/util.service';
import { AuthService } from './services/auth.service';
import { MenuService } from './services/menu.service';
import { EmpresasService } from './services/empresas.service';
import { EmpleadosService } from './services/empleados.service';
import { MapService } from './services/map.service';
import { ServiciosService } from './services/servicios.service';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BTInterceptor } from './util/interceptor';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AsignacionComponent } from './views/menus/asignacion/asignacion.component';
import { EmpresasComponent } from './views/menus/empresas/empresas.component';
import { EmpleadosComponent } from './views/menus/empleados/empleados.component';
import { ConsultasComponent } from './views/menus/consultas/consultas.component';

import { GmapComponent } from './views/controls/gmap/gmap.component';
import { FiltroEmpresaPipe } from './pipes/filtro-empresa.pipe';
import { LoadingComponent } from './views/controls/loading/loading.component';
import { PhotoUploaderComponent } from './views/controls/photo-uploader/photo-uploader.component';
import { FiltroEmpleadoPipe } from './pipes/filtro-empleado.pipe';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FiltroServicioPipe } from './pipes/filtro-servicio.pipe';
import { ClientesComponent } from './views/menus/clientes/clientes.component';
import { ClientesService } from './services/clientes.service';
import { FiltroClientePipe } from './pipes/filtro-cliente.pipe';
import { SolicitudesComponent } from './views/menus/solicitudes/solicitudes.component';
/*
############################################################
##                        route
############################################################
 */

registerLocaleData(localeEs, 'es-CO');

const appRoutes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'empresas', component: EmpresasComponent },
      { path: 'empleados', component: EmpleadosComponent },
      { path: 'asignacion', component: AsignacionComponent },
      { path: 'consultas', component: ConsultasComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'reanudaciones', component: SolicitudesComponent }
    ]
  }

];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AsignacionComponent,
    EmpresasComponent,
    EmpleadosComponent,
    ConsultasComponent,
    GmapComponent,
    FiltroEmpresaPipe,
    LoadingComponent,
    PhotoUploaderComponent,
    FiltroEmpleadoPipe,
    FiltroServicioPipe,
    ClientesComponent,
    FiltroClientePipe,
    SolicitudesComponent
  ],
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
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: HTTP_INTERCEPTORS, useClass: BTInterceptor, multi: true },
    AuthService,
    UsuarioService,
    UtilService,
    MenuService,
    EmpresasService,
    EmpleadosService,
    MapService,
    ServiciosService,
    ClientesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
