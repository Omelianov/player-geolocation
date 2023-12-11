let watchId;
let trackingInterval;
let map;
let customMarker;

// Custom marker icon
const customIcon = L.divIcon({
  className: 'custom-marker',
});

function initMap() {
  map = L.map('map').setView([0, 0], 14);

  // OpenStreetMap layer (main layer)
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  });

  // OpenTopoMap layer (topographic map)
  const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenTopoMap contributors'
  });

  // Add layers to the map
  osmLayer.addTo(map);
  topoLayer.addTo(map);

  // Create a layer control
  const baseLayers = {
    'OpenStreetMap': osmLayer,
    'OpenTopoMap': topoLayer,
  };

  L.control.layers(baseLayers).addTo(map);

  // Add a marker with initial coordinates
  const initialCoords = [0, 0];
  customMarker = L.marker(initialCoords, { icon: customIcon }).addTo(map);
}

// Function to start tracking
function startTracking() {
  const startButton = document.getElementById('startButton');
  startButton.disabled = true;
  stopButton.disabled = false;

  if ('geolocation' in navigator) {
    const coordinatesElement = document.getElementById('coordinateValues');

    // Options for the initial watchPosition request
    const initialOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

    // Stop current watchPosition if it exists
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(trackingInterval);
      console.log('Previous tracking stopped');
    }

    // Start watching position
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('New Location:', latitude, longitude);

        // Update text in the coordinates field
        coordinatesElement.textContent = `${latitude}, ${longitude}`;

        // Move the custom marker to the new location
        customMarker.setLatLng([latitude, longitude]);

        // Center and pan the map to the new location
        map.setView([latitude, longitude]);
      },
      (error) => {
        handleGeolocationError(error, 'Initial geolocation request');
      },
      initialOptions
    );

    // Set an interval to update the geolocation every 3 seconds
    trackingInterval = setInterval(() => {
      // Options for the updated getCurrentPosition request
      const updateOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

      // Get the updated position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Updated Location:', latitude, longitude);

          // Update text in the coordinates field
          coordinatesElement.textContent = `${latitude}, ${longitude}`;

          // Move the custom marker to the updated location
          customMarker.setLatLng([latitude, longitude]);

          // Center and pan the map to the updated location
          map.setView([latitude, longitude]);
        },
        (error) => {
          handleGeolocationError(error, 'Updated geolocation request');
        },
        updateOptions
      );
    }, 3000);
  } else {
    console.error('Geolocation is not supported');
  }
}

// Function to stop tracking
function stopTracking() {
  const startButton = document.getElementById('startButton');
  startButton.disabled = false;
  stopButton.disabled = true;

  if (watchId) {
    // Clear the geolocation watch and tracking interval
    navigator.geolocation.clearWatch(watchId);
    clearInterval(trackingInterval);
    console.log('Tracking stopped');
    watchId = null;
    trackingInterval = null;
  }
}

// Handle geolocation errors
function handleGeolocationError(error, context) {
  if (error.code === 3) {
    console.log(`${context} timed out`);
  } else if (error.code === 1) {
    console.log(`${context}: Location access denied by the user`);
  } else {
    console.error(`${context} error:`, error);
  }
}

// Function to update marker text
function updateMarkerText() {
  const markerText = document.getElementById('markerText').value;
  // Update the content of the custom marker with the entered text
  customMarker.bindPopup(markerText).openPopup();
}

// Event listeners for the start, stop, and update buttons
document.getElementById('startButton').addEventListener('click', startTracking);
document.getElementById('stopButton').addEventListener('click', stopTracking);
document.getElementById('updateButton').addEventListener('click', updateMarkerText);
