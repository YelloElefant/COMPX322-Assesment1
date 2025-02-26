async function getLocalEvents() {
   const response = await fetch('getLocalEvents.php', { mode: 'no-cors' });
   const data = await response.json();
   return data;
}

async function getEventDetails(eventID) {
   const response = await fetch(`getEventDetails.php?eventID=${eventID}`, { mode: 'no-cors' });
   const data = await response.json();
   return data;
}

async function getWeatherDetails(lonLat) {
   let [lat, lon] = lonLat.split(',');
   lon = lon.trim();
   lat = lat.trim();
   console.log(`Longitude: ${lon}, Latitude: ${lat}`);

   const url = "getWeather.php?lat=" + lat + "&lon=" + lon;
   const response = await fetch(url);
   const data = await response.json();
   return data;
}



function displayEvents(events) {
   const eventTable = document.getElementById('eventTable');

   console.log(events);

   const dataToDisplay = ['name', 'location'];
   events.forEach(event => {
      const row = document.createElement('tr');
      dataToDisplay.forEach(data => {
         const cell = document.createElement('td');
         cell.textContent = event[data];

         if (data === 'name') {
            const eventDetails = document.getElementById('eventDetails');
            const weatherInfo = document.getElementById('weatherInfo');
            cell.addEventListener('click', () => {
               eventDetails.style.display = 'block';
               getEventDetails(event.id).then(details => {
                  details = details[0];
                  console.log(details);
                  eventDetails.innerHTML = '';
                  Object.keys(details).forEach(key => {
                     const detail = document.createElement('p');
                     detail.textContent = `${key}: ${details[key]}`;
                     eventDetails.appendChild(detail);
                  });

                  const svgns = "http://www.w3.org/2000/svg";
                  const icon = document.createElementNS(svgns, "svg");
                  icon.innerHTML = '<circle cx="25" cy="25" r="24" stroke="green" fill="yellow" />';
                  icon.setAttribute('height', '50');
                  icon.setAttribute('width', '50');
                  icon.addEventListener('click', () => {
                     weatherInfo.style.display = 'block';
                     weatherInfo.innerHTML = '';

                     getWeatherDetails(details["lon_lat"]).then(weather => {
                        console.log(weather);
                        const weatherDetails = ['temp', 'humidity', 'weather'];
                        weatherDetails.forEach(weatherDetail => {
                           const detail = document.createElement('p');

                           detail.textContent = `${weatherDetail}: ${weather.main[weatherDetail]}`;

                           if (weatherDetail === 'weather') {
                              detail.textContent = `${weatherDetail}: ${weather.weather[0].description}`;
                           }

                           weatherInfo.appendChild(detail);
                        });
                     });

                  });
                  eventDetails.appendChild(icon);


               });
            });
         }


         row.appendChild(cell);
      });
      eventTable.appendChild(row);
   });

}

getLocalEvents().then(events => displayEvents(events));

