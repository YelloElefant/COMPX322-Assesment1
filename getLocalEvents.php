<?php
$con = null;

header('Content-Type: application/json');

try {
   $con = new PDO('mysql:host=learn-mysql.cms.waikato.ac.nz;dbname=at997', 'at997', 'my481662sql');
} catch (PDOException $e) {
   echo "Database connection error " . $e->getMessage();
}

$sql = "SELECT * FROM events";

// get all events turn into json
$events = $con->query($sql)->fetchAll(PDO::FETCH_ASSOC);

// only return name and location
$events = array_map(function ($event) {
   return [
      'name' => $event['name'],
      'location' => $event['location'],
      'id' => $event['id']

   ];
}, $events);



echo json_encode($events);
