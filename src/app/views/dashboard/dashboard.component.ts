import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from './../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { UtilService } from './../../services/util.service';
import { MenuService } from './../../services/menu.service';
import { SideMenu } from './../../models/SideMenu';
import { LoadingComponent } from '../controls/loading/loading.component';

declare var mlPushMenu;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuarios: any;
  count = 0;
  menus: SideMenu[] = [];
  @ViewChild('loader') loader: LoadingComponent;
  constructor(private usuarioSVC: UsuarioService, public util: UtilService, private menuSVC: MenuService, private auth: AuthService) { }

  ngOnInit() {
    const that = this;
    this.util.appState = 'INICIO';
    this.menus = this.menuSVC.getSideMenu(0);
    this.util.ShowLoading.subscribe(s => {
      if (s > 0) {
        that.loader.showLoader = true;
      } else {
        that.loader.showLoader = false;
      }
    });
  }

  ButtonClick() {

  }
}
