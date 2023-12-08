let watchId;
let trackingInterval;
let map;

function initMap() {
  map = L.map('map').setView([0, 0], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
}

function startTracking() {
  const startButton = document.getElementById('startButton');
  startButton.disabled = true;

  if ('geolocation' in navigator) {
    const coordinatesElement = document.getElementById('coordinateValues');

    const initialOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (watchId) { // Добавим проверку перед выполнением запросов
          const { latitude, longitude } = position.coords;
          console.log('New Location:', latitude, longitude);

          coordinatesElement.textContent = `${latitude}, ${longitude}`;

          const playerLocation = new L.LatLng(latitude, longitude);
          map.panTo(playerLocation);
        }
      },
      (error) => {
        handleGeolocationError(error, 'Initial geolocation request');
      },
      initialOptions
    );

    trackingInterval = setInterval(() => {
      if (watchId) { // Добавим проверку перед выполнением запросов
        const updateOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (watchId) { // Добавим проверку перед выполнением запросов
              const { latitude, longitude } = position.coords;
              console.log('Updated Location:', latitude, longitude);

              coordinatesElement.textContent = `${latitude}, ${longitude}`;

              const playerLocation = new L.LatLng(latitude, longitude);
              map.panTo(playerLocation);
            }
          },
          (error) => {
            handleGeolocationError(error, 'Updated geolocation request');
          },
          updateOptions
        );
      }
    }, 3000);
  } else {
    console.error('Geolocation is not supported');
  }
}

function stopTracking() {
  const startButton = document.getElementById('startButton');
  startButton.disabled = false;

  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    clearInterval(trackingInterval);
    watchId = null; // Установим watchId в null, чтобы указать, что трекинг остановлен
    console.log('Tracking stopped');
  }
}


function handleGeolocationError(error, context) {
  if (error.code === 3) {
    console.log(`${context} timed out`);
  } else if (error.code === 1) {
    console.log(`${context}: Location access denied by the user`);
  } else {
    console.error(`${context} error:`, error);
  }
}

document.getElementById('startButton').addEventListener('click', startTracking);
document.getElementById('stopButton').addEventListener('click', stopTracking);