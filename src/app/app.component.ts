import { Component, ViewContainerRef } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from './services/util.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';  

  constructor(private util : UtilService,private vcr: ViewContainerRef){
    this.util.init(this.vcr);
  }

  ngOnInit(){    
    $(document).foundation();    
  }

}
