import { Component, OnInit , Input , ElementRef , Renderer2} from '@angular/core';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  @Input() width : number = 0;
  @Input() height : number = 0;

  @Input() lng : number;
  @Input() lat : number;
  @Input() zoom : number;

  private mapa : HTMLElement;

  constructor(private renderer: Renderer2, private el: ElementRef) {

  }

  ngOnInit() {
    this.mapa = this.el.nativeElement.querySelector('div');
    this.mapa.style.width = this.width + "px";
    this.mapa.style.height = this.height + "px";
    this.mapa.style.backgroundColor = "red";
    //this.renderer.setStyle(this.el,"width",this.width);
    //this.renderer.setStyle(this.el,"height",this.height);

  }

}
