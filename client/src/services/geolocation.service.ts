import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Coordinates } from '../models/coordinates.model';

const GEOLOCATION_ERRORS = [
    'Browser does not support location services',
    'You have rejected access to your location',
    'Unable to determine your location',
    'Service timeout has been reached'
];

@Injectable()
export class GeolocationService {

    public rad(x: any): any {
        return x * Math.PI / 180;
    }

    public getDistance(p1: [number], p2: [number]): number {
        let R = 6378137; // Earth’s mean radius in meters
        let dLat = this.rad(p2[1] - p1[1]);
        let dLong = this.rad(p2[0] - p1[0]);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1[1])) * Math.cos(this.rad(p2[1])) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        return Math.floor(d); // returns the distance in meters
    }

    public getLocation(): Observable<Coordinates> {
        return Observable.create(observer => {
            if (window.navigator && window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition(
                    (position) => {
                        observer.next(new Coordinates({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        }));
                        observer.complete();
                    },
                    (error) => observer.error(GEOLOCATION_ERRORS[+error.code]));
            } else {
                observer.error(GEOLOCATION_ERRORS[0]);
            }
        });


    }

}


