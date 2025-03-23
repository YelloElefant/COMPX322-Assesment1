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

function formatSet(obj) {
  return Object.keys(obj)
    .map((key) => key + ' = "' + obj[key] + '"')
    .join(",");
}

(function dataColeciton() {
  fetch("events.php?eventID=all", { mode: "no-cors" })
    .then((events) => events.json())
    .then((events) => {
      const eventTable = document.getElementById("eventTable");
      eventTable.innerHTML = "";

      console.log(events);

      const dataToDisplay = ["name", "location"];
      events.forEach((event) => {
        const row = document.createElement("tr");

        const eventDetails = document.getElementById("eventDetails");
        const weatherInfo = document.getElementById("weatherInfo");

        row.addEventListener("click", () => {
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

          const icon = document.createElement("button");
          icon.innerHTML = "Get Weather";
          icon.addEventListener("click", () => {
            weatherInfo.style.display = "block";
            weatherInfo.innerHTML = "";
            let [lat, lon] = event["lon_lat"].split(",");
            lat = lat.trim();
            lon = lon.trim();
            fetch("getWeather.php?lat=" + lat + "&lon=" + lon)
              .then((weather) => weather.json())
              .then((weather) => {
                console.log(weather);
                const weatherDetails = ["temp", "humidity", "weather"];
                weatherDetails.forEach((weatherDetail) => {
                  const detail = document.createElement("p");

                  detail.textContent = `${weatherDetail}: ${weather.main[weatherDetail]}`;

                  if (weatherDetail === "weather") {
                    detail.textContent = `${weatherDetail}: ${weather.weather[0].description}`;
                  }

                  weatherInfo.appendChild(detail);
                });
              });
          });
          eventDetails.appendChild(icon);

          const saveButton = document.createElement("button");
          saveButton.innerHTML = "Save";
          saveButton.addEventListener("click", () => {
            const keys = document.getElementsByClassName("detailKey");
            let values = document.getElementsByClassName("detailValue");
            let changedValues = {};
            for (let i = 0; i < keys.length; i++) {
              if (values[i].innerHTML !== event[keys[i].innerHTML]) {
                if (values[i].innerHTML.includes("<br>")) {
                  values[i].innerHTML = values[i].innerHTML.replace("<br>", "");
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
              .then(dataColeciton());
          });

          eventDetails.appendChild(saveButton);
        });

        dataToDisplay.forEach((data) => {
          const cell = document.createElement("td");
          cell.innerHTML = event[data];
          row.appendChild(cell);
        });
        eventTable.appendChild(row);
      });
    });
})();
