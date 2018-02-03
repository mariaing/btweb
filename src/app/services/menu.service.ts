import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthService } from './auth.service';
import { SideMenu } from './../models/SideMenu';


@Injectable()
export class MenuService {

  constructor(private auth: AuthService) { }

  getSideMenu(rol: number) {
    const menus: Array<SideMenu> = [];
    if (this.auth.ObtenerUsuario().Rol === 0) {
      const item = new SideMenu('EMPRESAS', '/dashboard/empresas');
      menus.push(item);
    }
    menus.push(new SideMenu('EMPLEADOS', '/dashboard/empleados'));
    menus.push(new SideMenu('SERVICIOS ', '/dashboard/asignacion'));
    menus.push(new SideMenu('CONSULTAS', '/dashboard/consultas'));
    return menus;
  }
}
