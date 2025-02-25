async function getLocalEvents() {
   const response = await fetch('getLocalEvents.php', { mode: 'no-cors' });
   const data = await response.json();
   return data;
}

getLocalEvents().then(events => console.log(events));