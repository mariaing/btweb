import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { UsuarioService } from "../../services/usuario.service";
import { FormsModule } from "@angular/forms";
import { Input } from "@angular/core/src/metadata/directives";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UtilService } from './../../services/util.service';
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public username : string;
  public password : string;
  constructor(private user : UsuarioService, public toastr: ToastsManager,private router : Router) {       
  }
  ngOnInit() { }

  loggin(){    
    this.user.loggin(this.username,this.password);          
  }

  showSuccess(mensaje : string){
    this.toastr.success('You are awesome!', 'Success!');      
  }
}
