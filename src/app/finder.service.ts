import { Injectable } from '@angular/core';
import { Ubicaciones } from './model/ubicaciones';
import 'rxjs/add/operator/toPromise';
import { Http, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class FinderService {

  private ubicacionesUrl = 'http://localhost:8080/pruebaRest/rest/servicio/ubicaciones';

  /*
    ubicaciones: Ubicaciones[] = [
      { posicion: {latitud: -0.292018, longitud: -78.477846}, icono: 'icono', titulo: '1' },
      { posicion: {latitud: -0.285014, longitud: -78.472250}, icono: 'icono', titulo: '2' },
      { posicion: {latitud: -0.308758, longitud: -78.452609}, icono: 'icono', titulo: '3' },
      { posicion: {latitud: -0.312426, longitud: -78.479969}, icono: 'icono', titulo: '4' },
    ];
  */

  constructor(private http: Http) { }

  obtenerUbicaciones(latitud: any, longitud: any, distanciaBusqueda: any): Promise<Ubicaciones[]> {
    var options = new RequestOptions({
      headers: new Headers({
        'Accept': 'application/json',
        'Accept-Language': 'en-US'
      })
    });

    const body = {
                  'posicionActual': {
                    'latitud': latitud,
                    'longitud': longitud
                  },
                  'distancia': distanciaBusqueda
    };




    return this.http.post(this.ubicacionesUrl, body)
      .toPromise()
      .then(response => response.json().ubicaciones as Ubicaciones[])
      //.then(response => console.log('Response', response.json().ubicaciones))
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
