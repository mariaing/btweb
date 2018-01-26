import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2,
  ViewChild
} from '@angular/core';

declare var google;
declare var $;

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  @Input() width = 0;
  @Input() height = 0;

  @Input() lng: number;
  @Input() lat: number;
  @Input() zoom: number;
  @Input() name: string;

  @Input() DisableClickEvent = false;

  @ViewChild('mapaContent') mapa: ElementRef;
  @ViewChild('searchBox') input: ElementRef;

  private mapaName: string;
  private inputName: string;

  private ValleduparCood: any = { center: { lat: 10.4744508, lng: -73.2609084 }, zoom: 14 };

  private map: any;
  private searchBox: any;
  private markers: any[] = [];
  private interval: any = {};

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  private limpiarMarcadores() {
    this.markers.forEach((item) => {
      item.setMap(null);
    });
    this.markers = [];
  }

  public InitMap() {
    this.DeclareElements();
    this.InitializeElements();
    this.InitializeSearchBox();
    this.InitializeClick();
  }

  public DeclareElements() {
    this.mapa.nativeElement.id = this.name;
    this.mapa.nativeElement.style.width = '100%';
    this.mapa.nativeElement.style.height = this.height + 'px';
    this.input.nativeElement.id = 'input' + this.name;
  }

  private InitializeElements() {
    this.markers = [];
    this.map = new google.maps.Map(this.mapa.nativeElement, this.ValleduparCood);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.input.nativeElement);
  }

  private InitializeSearchBox() {
    const that = this;
    this.searchBox = new google.maps.places.SearchBox(this.input.nativeElement);
    this.searchBox.addListener('places_changed', function () {
      const places = that.searchBox.getPlaces();
      if (places.length === 0) { return; }

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach(function (place) {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }

        that.limpiarMarcadores();

        const marker = new google.maps.Marker({
          map: that.map,
          title: place.name,
          position: place.geometry.location
        });

        that.map.setZoom(14);
        that.map.panTo(marker.position);
        that.markers.push(marker);

      });
    });
  }

  private InitializeClick() {
    // tslint:disable-next-line:curly
    if (this.DisableClickEvent) return;

    const that = this;
    this.map.addListener('click', function (event) {
      that.limpiarMarcadores();

      const marker = new google.maps.Marker({
        position: event.latLng,
        map: that.map
      });

      that.markers.push(marker);
    });
  }

  ngOnInit() {

  }

  public SetMarker(lat: string, lng: string) {

    this.limpiarMarcadores();

    const marker = new google.maps.Marker({
      position: { lat: Number(lat), lng: Number(lng) },
      map: this.map
    });

    this.markers.push(marker);
    this.map.setZoom(14);
    this.map.panTo(marker.position);
  }

  public GetMarker() {

    if (this.markers.length > 0) {
      return this.markers[0].position;
    } else {
      return null;
    }
  }

  public ClearMarker() {
    this.markers = [];
  }
}
