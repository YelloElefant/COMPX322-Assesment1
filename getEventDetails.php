<?php
$con = null;

header('Content-Type: application/json');

try {
   $con = new PDO('mysql:host=learn-mysql.cms.waikato.ac.nz;dbname=at997', 'at997', 'my481662sql');
} catch (PDOException $e) {
   echo "Database connection error " . $e->getMessage();
}

$sql = "SELECT * FROM events WHERE id = " . $_GET['eventID'];

// get all events turn into json
$events = $con->query($sql)->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($events);
