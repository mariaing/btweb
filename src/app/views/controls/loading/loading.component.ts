import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  
  public showLoader = false;

  constructor() { }

  ngOnInit() {

  }

}
