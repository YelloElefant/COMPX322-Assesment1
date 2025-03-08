let abortController = new AbortController();
let weatherData = null;

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

         const dataToDisplay = ["name", "location"];
         events.forEach((event) => {
            const row = document.createElement("tr");
            row.addEventListener("click", () => {
               // Abort any ongoing fetch request
               abortController.abort();
               abortController = new AbortController();
               weatherData = null;

               const eventDetails = document.getElementById("eventDetails");
               const weatherInfo = document.getElementById("weatherInfo");
               weatherInfo.innerHTML = "";
               eventDetails.style.display = "block";
               console.log(event);
               eventDetails.innerHTML = "";

               Object.keys(event)
                  .sort()
                  .forEach((key) => {
                     const detail = document.createElement("tr");
                     detail.classList.add("eventDetail");

                     const detailKey = document.createElement("td");
                     detailKey.classList.add("detailKey");
                     detailKey.innerHTML = key;

                     const detailValue = document.createElement("td");
                     detailValue.classList.add("detailValue");
                     detailValue.setAttribute("contenteditable", "true");
                     detailValue.innerHTML = event[key];

                     detail.appendChild(detailKey);
                     detail.appendChild(detailValue);

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
                     if (values[i].innerHTML !== event[keys[i].innerHTML]) {
                        if (values[i].innerHTML.includes("<br>")) {
                           values[i].innerHTML = values[i].innerHTML.replace(
                              "<br>",
                              ""
                           );
                        }
                        changedValues[keys[i].innerHTML] = values[i].innerHTML.trim();
                        event[keys[i].innerHTML] = changedValues[keys[i].innerHTML];
                     }
                  }
                  let set = formatSet(changedValues);

                  console.log(set);
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
                     .then(() => {
                        cell.innerHTML = changedValues.name;
                     });
               });

               const showWeatherButton = document.createElement("button");
               showWeatherButton.innerHTML = "Show Weather";
               showWeatherButton.addEventListener("click", () => {
                  if (weatherData) {
                     weatherInfo.innerHTML = "";
                     weatherInfo.style.display = "block";
                     const weatherDetails = ["temp", "humidity", "weather"];
                     weatherDetails.forEach((weatherDetail) => {
                        const detail = document.createElement("p");

                        detail.textContent = `${weatherDetail}: ${weatherData.main[weatherDetail]}`;

                        if (weatherDetail === "weather") {
                           detail.textContent = `${weatherDetail}: ${weatherData.weather[0].description}`;
                        }

                        weatherInfo.appendChild(detail);
                     });
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
            eventTable.appendChild(row);
         });
      });
})();
