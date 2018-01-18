import { Component, OnInit } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openModal(){
    $('#myModal').foundation('open');
  }
}
