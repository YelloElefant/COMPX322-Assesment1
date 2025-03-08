<?php
$con = null;


try {
    $con = new PDO('mysql:host=192.168.1.29;port=3221;dbname=Assesment1', 'root', 'root');
} catch (PDOException $e) {
    echo "Database connection error " . $e->getMessage();
}

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    header('Content-Type: application/json');

    $id = "WHERE id = ";
    $eventID = isset($_GET['eventID']) ? $_GET['eventID'] : "0";

    if ($eventID == "all") {
        $id = " ";
    } else {
        $id = $id . $eventID;
    }

    $sql = "SELECT * FROM events " . $id;


    $events = $con->query($sql)->fetchAll(PDO::FETCH_ASSOC);





    echo json_encode($events);
} elseif ($_SERVER['REQUEST_METHOD'] == "POST") {
    $id = isset($_POST['id']) ? $_POST['id'] : "null";
    $set = isset($_POST['set']) ? $_POST['set'] : "null";

    $sql = "UPDATE events SET " . $set . " WHERE id = " . $id;

    $stmt = $con->prepare($sql);
    $stmt->execute();


    echo "changed " . $set . " :: on " .  $id;
}
