
// async function getWeatherDetails(lonLat) {
//    let [lat, lon] = lonLat.split(',');
//    lon = lon.trim();
//    lat = lat.trim();
//    console.log(`Longitude: ${lon}, Latitude: ${lat}`);

//    const url = ;
//    const response = await fetch("getWeather.php?lat=" + lat + "&lon=" + lon);
//    const data = await response.json();
//    return data;
// }


fetch('getLocalEvents.php', { mode: 'no-cors' })
   .then(events => events.json())
   .then(events => {

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
                  weatherInfo.innerHTML = "";
                  eventDetails.style.display = 'block';
                  console.log(event);
                  eventDetails.innerHTML = '';
                  Object.keys(event).forEach(key => {
                     const detail = document.createElement('p');
                     detail.textContent = `${key}: ${event[key]}`;
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
                     let [lat, lon] = event["lon_lat"].split(',');
                     lat = lat.trim()
                     lon = lon.trim()
                     fetch("getWeather.php?lat=" + lat + "&lon=" + lon)
                        .then(weather => weather.json())
                        .then(weather => {
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


                  ;
               });
            }


            row.appendChild(cell);
         });
         eventTable.appendChild(row);
      });



   });
