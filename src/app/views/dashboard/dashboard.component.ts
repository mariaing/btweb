import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../../services/auth.service";
import { UsuarioService } from './../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { UtilService } from './../../services/util.service';
import { MenuService } from './../../services/menu.services';
import { SideMenu } from './../../models/SideMenu';

declare var mlPushMenu;
@Component({
  selector: "app-dashboard",
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuarios: any;
  count = 0;
  menus: SideMenu[] = [];
  constructor(private usuarioSVC: UsuarioService, public util: UtilService, private menuSVC: MenuService, private auth: AuthService) {}

  ngOnInit() {
    this.util.appState = 'INICIO';
    this.menus = this.menuSVC.getSideMenu(0);
  }

  ButtonClick() {

  }
}
