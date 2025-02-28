<?php
header('Content-Type: application/json');
$lon = isset($_GET['lon']) ? $_GET['lon'] : 0;
$lat = isset($_GET['lat']) ? $_GET['lat'] : 0;



$url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$apikey";

$json = file_get_contents($url);
echo $json;
