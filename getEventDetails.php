<?php
$con = null;

header('Content-Type: application/json');

try {
   $con = new PDO('mysql:host=192.168.1.29;port=3221;dbname=Assesment1', 'root', 'root');
} catch (PDOException $e) {
   echo "Database connection error " . $e->getMessage();
}

$sql = "SELECT * FROM events WHERE id = " . $_GET['eventID'];

// get all events turn into json
$events = $con->query($sql)->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($events);
