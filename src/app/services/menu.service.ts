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
      const item = new SideMenu('EMPRESAS', '/dashboard/empresas', 'business');
      menus.push(item);
    }
    menus.push(new SideMenu('EMPLEADOS', '/dashboard/empleados', 'card_travel'));
    menus.push(new SideMenu('CONSULTAS', '/dashboard/consultas', 'find_in_page'));
    menus.push(new SideMenu('CLIENTES', '/dashboard/clientes', 'account_circle'));
    menus.push(new SideMenu('REANUDAR', '/dashboard/reanudaciones', 'assignment_turned_in'));
    return menus;
  }
}
