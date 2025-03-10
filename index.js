let abortController = new AbortController();
let weatherData = null;
let activeEvent = null;
let specialSlot = document.getElementById("specialSpot");
const eventTableOriginal = document.getElementById("eventTable").cloneNode(true);

function formatSet(obj) {
   console.log(Object.keys(obj));

   return Object.keys(obj)
      .map((key) => key + ' = "' + obj[key] + '"')
      .join(",");
}

(function main() {
   fetch("events.php?eventID=all", { mode: "no-cors" })
      .then((events) => events.json())
      .then((events) => {
         const eventTable = document.getElementById("eventTable");
         console.log(events);

         if (activeEvent !== null) {
            eventTableOriginal.querySelector("#specialSpot").innerHTML = specialSlot.innerHTML;
            eventTable.innerHTML = eventTableOriginal.innerHTML;
         }

         const dataToDisplay = ["name", "location"];
         events.forEach((event) => {
            const row = document.createElement("tr");


            row.addEventListener("click", () => {
               if (activeEvent) {
                  activeEvent.classList.remove("active");
                  activeEvent.style.display = "table-row";
               }
               activeEvent = row;
               activeEvent.classList.add("active");
               let specialSlot = document.getElementById("specialSpot");
               specialSlot.style.display = "table-row";
               specialSlot.innerHTML = row.innerHTML;
               console.log(specialSlot);

               row.style.display = "none";


               window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
               });

               abortController.abort();
               abortController = new AbortController();
               weatherData = null;

               const eventDetails = document.getElementById("eventDetails");
               const weatherInfo = document.getElementById("weatherInfo");
               weatherInfo.style.display = "none";
               weatherInfo.innerHTML = "";
               eventDetails.style.display = "block";
               console.log(event);
               eventDetails.innerHTML = "";

               Object.keys(event)
                  .sort()
                  .forEach((key) => {
                     if (key === "id") {
                        return;
                     }
                     const detail = document.createElement("tr");
                     detail.classList.add("eventDetail");

                     const detailKey = document.createElement("td");
                     detailKey.classList.add("detailKey");
                     // capitalize the first letter of the key
                     if (key === "lon_lat") {
                        detailKey.innerHTML = "Longitude, Latitude";
                     } else {
                        detailKey.innerHTML = key.charAt(0).toUpperCase() + key.slice(1);
                     }

                     detailKey.setAttribute("sql-key", key)

                     const detailValue = document.createElement("td");
                     detailValue.classList.add("detailValue");
                     detailValue.setAttribute("contenteditable", "true");
                     detailValue.classList.add("editable");
                     detailValue.innerHTML = event[key];

                     const pencil = document.createElement("i");
                     pencil.classList.add("fa", "fa-pencil-alt", "edit-icon");

                     detail.appendChild(detailKey);
                     detail.appendChild(detailValue);
                     detail.appendChild(pencil);

                     eventDetails.appendChild(detail);
                  });

               let buttonStorage = document.createElement("tr");
               buttonStorage.id = "buttonStorage";
               eventDetails.appendChild(buttonStorage);

               const fetchWeather = () => {
                  let [lat, lon] = event["lon_lat"].split(",");
                  lat = lat.trim();
                  lon = lon.trim();
                  fetch("getWeather.php?lat=" + lat + "&lon=" + lon, { signal: abortController.signal })
                     .then((weather) => weather.json())
                     .then((weather) => {
                        console.log(weather);
                        weatherData = weather;
                     })
                     .catch((err) => {
                        if (err.name === 'AbortError') {
                           console.log('Fetch aborted');
                        } else {
                           console.error('Fetch error:', err);
                        }
                     });
               };

               const saveButton = document.createElement("button");
               saveButton.innerHTML = "Save";
               saveButton.addEventListener("click", () => {
                  const keys = document.getElementsByClassName("detailKey");
                  let values = document.getElementsByClassName("detailValue");
                  let changedValues = {};
                  for (let i = 0; i < keys.length; i++) {
                     values[i].innerHTML = values[i].innerHTML.trim();
                     if (values[i].innerHTML !== event[keys[i].getAttribute("sql-key")]) {
                        if (values[i].innerHTML.includes("<br>")) {
                           values[i].innerHTML = values[i].innerHTML.replace(
                              "<br>",
                              ""
                           );
                        }
                        if (values[i].innerHTML.includes("&nbsp;")) {
                           values[i].innerHTML = values[i].innerHTML.replace(
                              "&nbsp;",
                              ""
                           );
                        }
                        changedValues[keys[i].getAttribute("sql-key")] = values[i].innerHTML.trim();
                        event[keys[i].getAttribute("sql-key")] = changedValues[keys[i].getAttribute("sql-key")];
                     }
                  }
                  let set = formatSet(changedValues);
                  // update the specilSlot with the new values
                  specialSlot.innerHTML = "";
                  dataToDisplay.forEach((data) => {
                     const cell = document.createElement("td");
                     cell.textContent = event[data];
                     specialSlot.appendChild(cell);
                  }
                  );
                  fetch("events.php", {
                     method: "POST",
                     headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                     },
                     body: new URLSearchParams({
                        set: set,
                        id: event.id,
                     }),
                  })
                     .then((response) => response.text())
                     .then((response) => console.log(response))
                     .then(() => main());
               });

               const showWeatherButton = document.createElement("button");
               showWeatherButton.innerHTML = "Show Weather";
               showWeatherButton.addEventListener("click", () => {
                  if (weatherData) {
                     weatherInfo.innerHTML = "";
                     weatherInfo.style.display = "inline";

                     // Basic Info
                     const basicInfo = document.createElement("div");
                     basicInfo.id = "basicInfo";
                     basicInfo.innerHTML = `
                        <h3>Weather:</h3>
                        <p>Current Temperature: ${weatherData.main.temp} °C / ${((weatherData.main.temp * 9 / 5) + 32).toFixed(2)} °F</p>
                        <p>Feels Like Temperature: ${weatherData.main.feels_like} °C / ${((weatherData.main.feels_like * 9 / 5) + 32).toFixed(2)} °F</p>
                        <p>Weather Condition: ${weatherData.weather[0].description}</p>
                        <p>Humidity: ${weatherData.main.humidity}%</p>
                        <p>Wind Speed: ${weatherData.wind.speed} m/s, Direction: ${weatherData.wind.deg}°</p>
                        <p>Precipitation Chance: ${weatherData.rain ? weatherData.rain["1h"] : 0} mm/h</p>
                        <p>Sunrise: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                        <p>Sunset: ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
                        `;
                     weatherInfo.appendChild(basicInfo);


                  } else {
                     console.log("Weather data is still loading...");
                  }
               });

               buttonStorage.appendChild(saveButton);
               buttonStorage.appendChild(showWeatherButton);

               // Fetch weather data when the event is clicked
               fetchWeather();
            });
            dataToDisplay.forEach((data) => {
               const cell = document.createElement("td");
               cell.textContent = event[data];
               row.appendChild(cell);
            });
            try {
               console.log(specialSlot.innerHTML == row.innerHTML);
               if (specialSlot.innerHTML == row.innerHTML) {
                  console.log("active");

                  row.classList.add("active");
                  row.style.display = "none";
                  activeEvent = row;
               }
            } catch (e) { }
            eventTable.appendChild(row);
         });
      });
})();
