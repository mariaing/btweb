import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

declare var google;

@Injectable()
export class MapService {

  private nameMap : string;
  private nameInput : string;

  public mapa : HTMLElement;
  public markers: any[] = [];
  public htmlSearchBox: HTMLElement;
  public ValleduparCood: any = { center: { lat: 10.4744508, lng: -73.2609084 }, zoom: 14 };

  constructor() {

  }

  public init(MapName : string, searchBoxName? : string){
    this.nameMap = MapName;
    this.nameInput = searchBoxName;

    this.htmlSearchBox = document.getElementById('pac-input');
    this.mapa 
  }

/*
  getMap(name: string) {
    return this.mapas[name];
  }*/

  initMap(name: string) {
    /*
    try {
      if (typeof google !== 'undefined') {
        if (typeof name !== 'undefined') {

          //obtener el div del mapa
          var mapa = document.getElementById(name);

          //guardar el mapa en los array de mapas.          
          //this.mapas[name] = mapa;

          var that = this;

          //inicializar mapa con la api de google.        
          var map = new google.maps.Map(mapa, this.ValleduparCood);
          
          var searchBox = new google.maps.places.SearchBox(input);
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

          // Bias the SearchBox results towards current map's viewport.
          map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
          });


          // Listen for the event fired when the user selects a prediction and retrieve
          // more details for that place.
          searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
              return;
            }

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
              if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
              }

              that.limpiarMarcadores();

              var marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
              });

              // Create a marker for each place.
              that.markers.push(marker);

              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            map.fitBounds(bounds);
          });

          //inicializa el listener.
          google.maps.event.addListener(map, 'click', function (event) {

            that.limpiarMarcadores();

            var marker = new google.maps.Marker({
              position: event.latLng,
              map: map
            });

            that.markers.push(marker);

          });

        }
      }
    } catch (e) {
      console.log(e);
    }*/
  }

  GetLocation() {
    return this.markers[0];
  }

  limpiarMarcadores() {
    this.markers.forEach((item) => {
      item.setMap(null);
    });
    this.markers = [];
  }
}
