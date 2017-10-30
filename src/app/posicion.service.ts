import { Injectable } from '@angular/core';
declare var google: any;

@Injectable()
export class PosicionService {

  constructor() { }

  obtenerPosicionDispositivo(): void {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const ubicacionActual = new google.maps.LatLng (position.coords.latitude, position.coords.longitude);
        console.log('crea marca');
      },
        function () {
          console.log('Error geolocalization');
        }
      );
    } else {
      alert ('Error: Tu navegador no soporta geolocalización o la tiene desactivada');
    }

  }



}
