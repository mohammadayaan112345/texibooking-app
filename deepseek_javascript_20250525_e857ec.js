import AIDispatcher from './dispatcher.js';
import MapService from './map-service.js';
import ContactService from './contact-service.js';

class TaxiApp {
  constructor() {
    this.dispatcher = new AIDispatcher();
    this.mapService = new MapService();
    this.contactService = new ContactService();
    this.userLocation = null;
    this.init();
  }

  async init() {
    await this.initServices();
    this.registerSW();
    this.setupUI();
  }

  async initServices() {
    try {
      this.userLocation = await this.mapService.getCurrentLocation();
      await this.contactService.init();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  registerSW() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered:', registration);
          })
          .catch(error => {
            console.log('SW registration failed:', error);
          });
      });
    }
  }

  setupUI() {
    // UI initialization code
    document.getElementById('book-btn').addEventListener('click', this.bookRide.bind(this));
  }

  async bookRide() {
    const pickup = this.userLocation;
    const destination = this.mapService.getDestination();
    
    const request = {
      id: this.generateId(),
      pickup,
      destination,
      time: new Date()
    };
    
    this.dispatcher.requestRide(request);
    this.showNearbyDrivers();
  }

  showNearbyDrivers() {
    this.mapService.showNearbyDrivers()
      .then(drivers => {
        // AI-powered sorting
        drivers.sort((a, b) => this.dispatcher.aiModel.compareDrivers(a, b));
        this.updateDriverList(drivers);
      });
  }

  updateDriverList(drivers) {
    // Update UI with driver list
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Initialize app
new TaxiApp();