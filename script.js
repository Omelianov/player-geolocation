let watchId;
let trackingInterval;

function startTracking() {
  const startButton = document.getElementById('startButton');
  startButton.disabled = true;
  if ('geolocation' in navigator) {
    const coordinatesElement = document.getElementById('coordinateValues');

    // Опции для первоначального запроса watchPosition
    const initialOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('New Location:', latitude, longitude);

        // Обновляем текст в поле координат
        coordinatesElement.textContent = `${latitude}, ${longitude}`;

        // Здесь вы можете отправить данные на сервер через WebSocket или другим способом
      },
      (error) => {
        handleGeolocationError(error, 'Initial geolocation request');
      },
      initialOptions
    );

    // Устанавливаем интервал обновления геолокации каждые 3 секунды
    trackingInterval = setInterval(() => {
      // Опции для обновленного запроса getCurrentPosition
      const updateOptions = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Updated Location:', latitude, longitude);

          // Обновляем текст в поле координат
          coordinatesElement.textContent = `${latitude}, ${longitude}`;

          // Здесь также вы можете отправить данные на сервер
        },
        (error) => {
          handleGeolocationError(error, 'Updated geolocation request');
        },
        updateOptions
      );
    }, 5000);
  } else {
    console.error('Geolocation is not supported');
  }
}

function stopTracking() {
  const startButton = document.getElementById('startButton');
  startButton.disabled = false;
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    clearInterval(trackingInterval); // Очищаем интервал при остановке отслеживания
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
