<?php
header('Content-Type: application/json');
$lon = isset($_GET['lon']) ? $_GET['lon'] : 0;
$lat = isset($_GET['lat']) ? $_GET['lat'] : 0;



$url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=77c6eeaedce8e1980f6e4fb43b005e2e";

$json = file_get_contents($url);
echo $json;
