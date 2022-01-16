<?
	// Connect to mysql
	$servername = "localhost";
	$username = "calmprep_anton";
	$password = "MySQL1@bbb";
	$dbname = "calmprep_hunimal";

	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		$error = $conn->connect_error;
		echo 'Got connect error '. $error;
	}

	$sql = "select id,number,color,available from store_3d_prints;";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$resRequests = $stmt->get_result();

	// Build availability dictionary
	$digitsAvailDict = array();
	while ($row = $resRequests->fetch_row()) {
		$num = $row[1];
		$col = $row[2];
		$avail = $row[3];
		$key = "$num.$col";
		$digitsAvailDict[$key] = $avail;
	}
	
	$colors = array('Purple', 'Yellow', 'Orange', 'Green', 'Blue', 'Pink', 'Red');

	for ($i = 0; $i < 100; $i++) {
		foreach ($colors as $col) {
			$key = "$i.$col";
			if (!array_key_exists($key, $digitsAvailDict)) {
				$sql = "insert into store_3d_prints (color, available, number) values (?, 0, ?);";
				$stmt = $conn->prepare($sql);
				$stmt->bind_param('si', $col, $i);
				$stmt->execute();
				if ($conn->error) {
					$error = $conn->error;
					echo $error;
				}
			}
		}
	}
?>
