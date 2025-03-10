export class Mapa {
    #map;
    #currentLat;
    #currentLng;
    #markers = []; // Lista para almacenar los marcadores y poder borrarlos luego

    constructor() {
        const mapCenter = [41.3851, 2.1734];
        const zoomLevel = 6;

        this.#map = L.map('map').setView(mapCenter, zoomLevel);
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
            attribution: '&copy; OpenStreetMap contributors' 
        });
        tileLayer.addTo(this.#map);

        //quan construim la instancia agafem les coordenades del navegador del usuari
        this.mostrarPuntInicial();                    //EDIT
    }

    //debe mostrar el punto inicial de la posición actual
    async mostrarPuntInicial() {
        try {
            const { lat, lng } = await this.#getPosicioActual();
            this.mostrarPunt(lat, lng, "Estàs aquí");
        } catch (error) {
            console.error("No se pudo obtener la ubicación inicial:", error);
        }
    }

    actualizarPosInitMapa(lat, long) {
        //actualitza la posicio actual del mapa
        this.#map.setView([lat, long], 6); 
    }

    mostrarPunt(lat, lon, desc = "") {
        //mostrará un punto según la latitud y longitud pasadas por parametros
        //desc, será la descripción que se mostrará al hacer click sobre el pundo situado en el mapa
        // Borra marcadores previos y coloca uno nuevo          //EDIT
        //this.borrarPunt();                                      //EDIT
        const marker = L.marker([lat, lon]).addTo(this.#map)
            .bindPopup(desc)
            .openPopup();

        this.#markers.push(marker); // Guardamos el marcador en la lista
    }

    borrarPunt() {
        //borrará a todos los puntos del mapa
        this.#markers.forEach(marker => this.#map.removeLayer(marker)); // Eliminar todos los marcadores
        this.#markers = []; // Vaciar la lista
    }

    #getPosicioActual() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    this.#currentLat = position.coords.latitude;
                    this.#currentLng = position.coords.longitude;
                    resolve({ lat: this.#currentLat, lng: this.#currentLng });
                }, error => reject(error));
            } else {
                reject("Geolocalización no disponible");
            }
        });
    }
}