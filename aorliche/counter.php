<!DOCTYPE html>
<html>
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
</head>
<body>
<style>
body {
	margin: 0px;
	padding: 0px;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	width: 50px;
	text-align: right;
}
</style>
<?
    $servername = "localhost";
    $username = "calmprep_anton";
    $password = "MySQL1@bbb";
    $dbname = "calmprep_hunimal";
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    $sql = "UPDATE visitor_count_aorliche SET count = count+1 WHERE idx = 1";
    $conn->query($sql);

    $sql = "SELECT count FROM visitor_count_aorliche WHERE idx = 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $visits = $row["count"];
        }
        printf("%05d", $visits);
    } else {
        echo "no results";
    }
    
    $conn->close();
?>
</body>
</html>
