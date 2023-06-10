<?
	header("content-type: application/json");

    $servername = "localhost";
    $username = "calmprep_anton";
    $password = "MySQL1@bbb";
    $dbname = "calmprep_pigcoin";
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        //die("Connection failed: " . $conn->connect_error);
		echo(json_encode("fail" . $conn->connect_error));
		return;
    } 

	$sql = null;

	if ($_GET["what"] == "wallets" || $_GET["what"] == null) {
		$sql = "SELECT * from wallets";
	} else if ($_GET["what"] == "transactions") {
		$sql = "SELECT * from regular_transactions";
	}

	if ($sql == null) {
		echo(json_encode("fail: unknown query"));
	}

	$result = $conn->query($sql);
	$allrows = array();
	if ($result->num_rows > 0) {
		while ($row = $result->fetch_assoc()) {
			array_push($allrows, $row);
		}
	}
	echo(json_encode($allrows));

    $conn->close();
?>
