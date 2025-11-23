<?php
// get_products.php
header('Content-Type: application/json');

// 1. Connect to Database
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'online_store';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 2. Fetch Products
$sql = "SELECT * FROM products";
$result = $conn->query($sql);

$products = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Add "prod" prefix to ID to match your old format if needed, or just use the number
        // We cast price to float to ensure JS handles math correctly
        $row['price'] = (float)$row['price'];
        $products[] = $row;
    }
}

// 3. Return data as JSON
echo json_encode($products);

$conn->close();
?>