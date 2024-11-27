<?php
include('functions.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'];
    
    if ($action == 'register') {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        echo registerMember($name, $email, $password) ? "success" : "error";
    }
    
    if ($action == 'login') {
        $email = $_POST['email'];
        $password = $_POST['password'];
        $user = loginMember($email, $password);
        echo $user ? json_encode($user) : "invalid";
    }
    
    // Add logic for other actions like reservation creation, deletion.
}
?>
