<?php
include('db.php');

function registerMember($name, $email, $password) {
    global $conn;
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $query = "INSERT INTO members (name, email, password) VALUES ('$name', '$email', '$passwordHash')";
    return $conn->query($query);
}

function loginMember($email, $password) {
    global $conn;
    $query = "SELECT * FROM members WHERE email = '$email'";
    $result = $conn->query($query);
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            return $user;
        }
    }
    return false;
}

function createReservation($member_id, $date, $time) {
    global $conn;
    $query = "INSERT INTO reservations (member_id, date, time) VALUES ('$member_id', '$date', '$time')";
    return $conn->query($query);
}

// Add similar functions for updating and deleting reservations.
?>
