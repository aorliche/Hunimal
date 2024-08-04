<?php
    $servername = "localhost";
    $username = "calmprep_anton";
    $password = "MySQL1@bbb";
    $dbname = "calmprep_hunimal";
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
	} 

	$stmt = $conn->prepare('select id,seconds,correct,tried from quiz_times where name = ?');
	$stmt->bind_param('s', $_GET['name']);
	$stmt->execute();
	$res = $stmt->get_result();

	if ($res->num_rows == 0) {
		$stmt = $conn->prepare('insert into quiz_times (name,seconds,correct,tried) value(?,?,?,1)');
		$stmt->bind_param('sii', $_GET['name'], $_GET['delta'], $_GET['corr']);
		$stmt->execute();
	} else if ($res->num_rows == 1) {
		$row = $res->fetch_assoc();
		$stmt = $conn->prepare('update quiz_times set seconds = ?, correct = ?, tried = tried+1 where name = ?');
		$i1 = intval($_GET['delta']) + intval($row['seconds']); 
		$i2 = intval($row['correct']) + intval($_GET['corr']); 
		$stmt->bind_param('iis', $i1, $i2, $_GET['name']);
		$stmt->execute();
	}
?>
