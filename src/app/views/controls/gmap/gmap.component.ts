import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2
} from '@angular/core';


declare var google;
declare var $;

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  @Input() width: number = 0;
  @Input() height: number = 0;

  @Input() lng: number;
  @Input() lat: number;
  @Input() zoom: number;

  @Output() onLoadComplete = new EventEmitter();

  private mapa: HTMLElement;
  private input: HTMLElement;
  private ValleduparCood: any = { center: { lat: 10.4744508, lng: -73.2609084 }, zoom: 14 };

  private map: any;
  private searchBox: any;
  private markers: any[] = [];
  private interval: any = {};

  constructor(private renderer: Renderer2, private el: ElementRef) {

  }

  private limpiarMarcadores() {
    this.markers.forEach((item) => {
      item.setMap(null);
    });
    this.markers = [];
  }

  public InitMap() {
    this.InitializeElements();
    this.InitializeSearchBox();
    this.InitializeClick();
  }

  private InitializeElements() {
    this.map = new google.maps.Map(this.mapa, this.ValleduparCood);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.input);
  }

  private InitializeAutocomplete() {
    var that = this;
    var marker = new google.maps.Marker({ map: this.map, anchorPoint: new google.maps.Point(0, -29) });

    this.searchBox = new google.maps.places.Autocomplete(this.input);
    this.searchBox.bindTo('bounds', this.map);
    this.searchBox.addListener('place_changed', function () {

      var infowindow = new google.maps.InfoWindow();
      var place = that.searchBox.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        that.map.fitBounds(place.geometry.viewport);
      } else {
        that.map.setCenter(place.geometry.location);
        that.map.setZoom(17);  // Why 17? Because it looks good.
      }

      marker.setIcon(/** @type {google.maps.Icon} */({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(that.map, marker);
    });
  }

  private InitializeSearchBox() {
    var that = this;
    this.searchBox = new google.maps.places.SearchBox(this.input);
    this.searchBox.addListener('places_changed', function () {
      var places = that.searchBox.getPlaces();
      if (places.length == 0) { return; }

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function (place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        that.limpiarMarcadores();

        var marker = new google.maps.Marker({
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
    var that = this;
    this.map.addListener('click', function (event) {
      
      that.limpiarMarcadores();

      var marker = new google.maps.Marker({
        position: event.latLng,
        map: that.map
      });

      that.markers.push(marker);
    });
  }

  ngOnInit() {
    this.mapa = this.el.nativeElement.querySelector('div');
    this.mapa.style.width = this.width + "px";
    this.mapa.style.height = this.height + "px";
    this.input = this.el.nativeElement.querySelector('input');
  }

  public GetMarker() {
    this.map.markers[0];
  }
}
