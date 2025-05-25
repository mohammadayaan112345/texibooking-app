class ContactService {
  constructor() {
    this.contacts = [];
  }

  async init() {
    if (!navigator.contacts) {
      console.warn('Contact Picker API not supported');
      return;
    }
    
    try {
      const props = ['name', 'email', 'tel'];
      const opts = { multiple: true };
      this.contacts = await navigator.contacts.select(props, opts);
    } catch (error) {
      console.error('Contact access error:', error);
    }
  }

  async contactDriver(driver) {
    // Check if driver has preferred contact method
    const contactMethod = driver.contactMethods.find(m => 
      this.contacts.some(c => c.tel && c.tel.includes(m))
    );
    
    if (contactMethod) {
      // Use Web Share API if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Contact ${driver.name}`,
            text: `Hello ${driver.name}, I'm your passenger`,
            url: `tel:${contactMethod}`
          });
          return;
        } catch (error) {
          console.log('Share cancelled', error);
        }
      }
      
      // Fallback to direct call
      window.location.href = `tel:${contactMethod}`;
    } else {
      // Fallback to in-app messaging
      this.showInAppMessaging(driver.id);
    }
  }

  showInAppMessaging(driverId) {
    // Implement WebSocket-based messaging
  }
}