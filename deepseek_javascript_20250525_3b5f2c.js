class MapService {
  constructor() {
    this.map = null;
    this.directionsService = null;
    this.directionsRenderer = null;
    this.markers = [];
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 15
    });
    
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);
  }

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.map.setCenter(pos);
            resolve(pos);
          },
          () => {
            reject(new Error('Geolocation failed'));
          }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  }

  async showNearbyDrivers() {
    // In a real app, this would call your backend API
    const response = await fetch('/api/drivers/nearby', {
      method: 'POST',
      body: JSON.stringify({ location: this.userLocation }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    const drivers = await response.json();
    this.updateDriverMarkers(drivers);
    return drivers;
  }

  updateDriverMarkers(drivers) {
    // Clear existing markers
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    
    // Add new markers
    drivers.forEach(driver => {
      const marker = new google.maps.Marker({
        position: driver.location,
        map: this.map,
        icon: {
          url: '/images/car-icon.png',
          scaledSize: new google.maps.Size(32, 32)
        }
      });
      this.markers.push(marker);
    });
  }

  async calculateRoute(origin, destination) {
    return new Promise((resolve, reject) => {
      this.directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
      }, (response, status) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
          resolve(response);
        } else {
          reject(new Error('Directions request failed'));
        }
      });
    });
  }
}