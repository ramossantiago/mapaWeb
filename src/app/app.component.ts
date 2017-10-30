import { Component, OnInit } from '@angular/core';
import { FinderService } from './finder.service';
import { Ubicaciones } from './model/ubicaciones';
import { Posicion } from './model/posicion';
declare var MarkerClusterer: any;
declare var google: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [FinderService]
})
export class AppComponent implements OnInit {
  mapa: any;
  ubicaciones: Ubicaciones[];
  posicionActual: Posicion;
  marcas: any;
  markerCluster: any;
  marcaPosicion: any;
  distanciaBusqueda: any;
  circuloBusqueda: any;

  /**
   * Constructor
   * @param finderService servicio de busqueda de localidades
   */
  constructor(private finderService: FinderService) {
    this.posicionActual = new Posicion();
   }

  /**
   * Funcion que se ejecuta despúes del constructor
   */
  ngOnInit() {
    this.iniciaMapa();
    this.obtenerUbicacionDispositivo();

    /**
     * codigo para poner una marca con un click, no funciona aun
     */
    /*instancia.mapa.addListener('dblclick', function(event) {
      console.log('agregar marker');
      const marker = new google.maps.Marker({
        position: event.latLng,
        map: instancia.mapa
      });
    });
    */

  }

  /**
   * Inicia el mapa en una posicion determinada
   */
  iniciaMapa(): void {
    const instancia = this;
    const centroTemporal = new google.maps.LatLng(-0.285723, -78.483025);

    const propiedadesDelMapa = {
      center: centroTemporal,
      zoom: 16,
      maxZoom: 18,
      minZoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    instancia.mapa = new google.maps.Map(document.getElementById('map-container'), propiedadesDelMapa);
  }


  obtenerUbicacionDispositivo(): void {
    const instancia = this;

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            instancia.posicionActual.latitud = position.coords.latitude;
            instancia.posicionActual.longitud = position.coords.longitude;

            instancia.centrarMapaEnUbicacionDispositivo();
            instancia.borrarMarcaUbicacionActual();
            instancia.dibujarMarcaDeUbicacionDispositivo();
            instancia.manejarEventoArrastrarMarcaUbicacion();

          },
            function () {
              handleLocationError(true, this.infoWindow, instancia.mapa.getCenter());
            }
          );
        } else {
          alert ('Error: Tu navegador no soporta geolocalización o la tiene desactivada');
          //handleLocationError(false, this.infoWindow, instance.mapa.getCenter());
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
          infoWindow.setPosition(pos);
          infoWindow.setContent(browserHasGeolocation ?
            'Error: El servicio de localización no esta funcionando' :
            'Error: Tu navegador no soporta geolocalización o la tiene desactivada');
        }
  }

  /**
   * Centra el mapa en la ubicacion actual del dispositivo
   */
  centrarMapaEnUbicacionDispositivo(): void {
    const ubicacionActual = new google.maps.LatLng (this.posicionActual.latitud, this.posicionActual.longitud);
    this.mapa.setCenter(ubicacionActual);
  }

  /**
   * Dibuja una marca de ubicacion en la ubicacion del dispositivo
   */
  dibujarMarcaDeUbicacionDispositivo(): void {
    const ubicacionActual = new google.maps.LatLng (this.posicionActual.latitud, this.posicionActual.longitud);
    this.marcaPosicion = new google.maps.Marker({
      position: ubicacionActual,
      map: this.mapa,
      title: 'Tu estas aquí',
      draggable: true,
      icon: '../assets/icons/ic_place_black_24dp_2x.png'
    });
    console.log('crea marca');

    this.marcaPosicion.setMap(this.mapa);

  }

  /**
   * manejo el evento de arrastrar el punto centro, cambiando el centro del circulo de busqueda
   */
  manejarEventoArrastrarMarcaUbicacion(): void {
    console.log('crea manejador de ventos');
    const instancia = this;
    instancia.marcaPosicion.addListener('drag', function(event) {
      const latitudCentro = instancia.marcaPosicion.getPosition().lat();
      const longitudCentro = instancia.marcaPosicion.getPosition().lng();
      if (instancia.circuloBusqueda) {
        instancia.circuloBusqueda.setCenter(new google.maps.LatLng(latitudCentro, longitudCentro));
      }
    });
  }

  /**
   * Busca las ubicaciones desde servicio web
   */
  buscarUbicaciones(): void {
    const latitudCentro = this.marcaPosicion.getPosition().lat();
    const longitudCentro = this.marcaPosicion.getPosition().lng();
    const distanciaMaxima = this.distanciaBusqueda;

    this.finderService.obtenerUbicaciones(latitudCentro, longitudCentro, distanciaMaxima).then(ubica => {
      this.ubicaciones = ubica;
      this.borrarUbicaciones();
      this.imprimirUbicaciones();
      this.borrarCirculoBusqueda();
      this.dibujarCirculoBusqueda();
    });
  }

  /**
   * Imprime las ubicaciones devueltas por el servicio
   */
  imprimirUbicaciones(): void {

    console.log(this.ubicaciones);

    this.marcas = this.ubicaciones.map(function (item, i) {

      var myLatlng = new google.maps.LatLng(item.posicion.latitud, item.posicion.longitud);

      return new google.maps.Marker({
        position: myLatlng,
        label: item.titulo,
        animation: google.maps.Animation.DROP,
        icon: '../assets/icons/ic_local_pharmacy_black_24dp_1x.png'
      });
    });

    this.markerCluster = new MarkerClusterer(this.mapa, this.marcas,
      { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

  }

   /**
   * borra el circulo alrededor de la ubicacion del dispositivo
   */
  borrarCirculoBusqueda(): void {
    if (this.circuloBusqueda) {
      this.circuloBusqueda.setMap(null);
    }
  }

  /**
   * Pinta un circulo alrededor de la ubicacion del dispositivo con un radio igual a la distancia de busqueda
   */
  dibujarCirculoBusqueda(): void {
    const latitudCentro = this.marcaPosicion.getPosition().lat();
    const longitudCentro = this.marcaPosicion.getPosition().lng();
    const distanciaMaxima = this.distanciaBusqueda;

    this.circuloBusqueda = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.20,
      map: this.mapa,
      center: {lat: latitudCentro, lng: longitudCentro},
      radius: Number(distanciaMaxima)
    });

  }

   /**
   * borra las ubicaciones agregadas al cluster
   */
  borrarUbicaciones(): void {
    const cluster = this.markerCluster;

    if (cluster) {
      this.marcas.map(function (item, i){
        cluster.removeMarker(item);
      });
    }
  }

  /**
   * Borra la marca de la ubicacion actual del dispositivo
   */
  borrarMarcaUbicacionActual(): void {
    if (this.marcaPosicion) {
      this.marcaPosicion.setMap(null);
    }
  }

  /**
   * Imprime la posicion centro del mapa, y la posicion de la marca de centro
   */
  print(): void {
    console.log('latitud ', this.mapa.getCenter().lat());
    console.log('longitud ', this.mapa.getCenter().lng());
    console.log('latitud 2', this.marcaPosicion.getPosition().lat());
    console.log('longitud 2', this.marcaPosicion.getPosition().lng());
  }




}
