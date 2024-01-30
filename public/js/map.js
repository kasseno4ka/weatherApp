
let map;


document.addEventListener('DOMContentLoaded', () => {
    map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let marker, circle, zoomed;
    navigator.geolocation.watchPosition(success, error);
    function success(pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        if (marker) {
            map.removeLayer(marker);
            map.removeLayer(circle);
        }

         marker = L.marker([lat, lng]).addTo(map);
         circle = L.circle([lat, lng], {radius: accuracy }).addTo(map); 
        if(!zoomed){
           zoomed =  map.fitBounds(circle.getBounds());

        }
    }
    function error(err) {
        if(err.code === 1){
            alert("Please allow geolocation access");
        
        }else{
            alert("Cannot get current location");
        }
    }

    map.on('click', onMapClick);
});
function onMapClick(e) {
    const {lat, lng} = e.latlng;
    console.log(lat + " " + lng);

    fetch(`/weather?lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
            const weatherContainer = document.getElementById('weather-container');
            
            const iconUrl = `http://openweathermap.org/img/w/${data.icon}.png`;

            weatherContainer.innerHTML = `
            <h2>Weather Information</h2>
            <p><strong>Coordinates:</strong> <br> ${data.coordinates.lon} ${data.coordinates.lat} </p>
            <p><strong>Address:</strong> ${data.address} </p>
            <p><strong>Temperature:</strong> ${data.temperature - 273} C</p>
            <img src="${iconUrl}" alt="Weather Icon" style="border: 2px solid black;" />
            <p><strong>Feels like:</strong> ${data.feelsLike - 273}</p>
            <p><strong>Humidity:</strong> ${data.humidity}% </p>
            <p><strong>Pressure:</strong> ${data.pressure} hPa</p>
            <p><strong>Wind Speed:</strong> ${data.windSpeed} m/s</p>
            <p><strong>Country code:</strong> ${data.countryCode}</p>
            <p><strong>Rain volume for last 3 hours:</strong> ${data.rainVolumeLast3Hours}</p>
            <p><strong>Description:</strong> ${data.description}</p>
            <div id="additionalInfo" style="border: 1px solid #ccc; border-radius: 5px; padding: 10px; margin: 10px;">
                <p style="border-bottom: 1px solid #ccc;"><strong>Cloud:</strong> ${data.cloud}%</p>
                <p style="border-bottom: 1px solid #ccc;"><strong>Visibility:</strong> ${data.visibility}m</p>
                <p><strong>Gust Speed:</strong> ${data.gustSpeed}m/s</p>
            </div>
        

          `;
        })
        .catch(error => console.error('Error fetching data:', error));
}

function getAddressByCoordinate(lat, lng) {
    
}