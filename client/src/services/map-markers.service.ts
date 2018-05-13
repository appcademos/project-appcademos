import { Injectable } from '@angular/core';

//interface for marker
interface marker {
    lat: number;
    lng: number;
    label?: string;
    content?: string;
    draggable: boolean;
  }
  

@Injectable()
export class MapMarkersService {
    zoom: number = 15;
    markers: marker[] = [];
    academyMarker: marker;

constructor() { }

}
