<?php
header('Content-Type: application/json');
$lon = isset($_GET['lon']) ? $_GET['lon'] : 0;
$lat = isset($_GET['lat']) ? $_GET['lat'] : 0;



$url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$apiKey";


$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$json = curl_exec($ch);
curl_close($ch);


echo $json;
