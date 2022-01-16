<?
	header("content-type: application/json");
	
	if (!isset($_GET['ip'])) {
		$result = array(
			'result' => 'error',
			'reason' => 'no IP'
		);
		goto finish;
	}
	$ip = $_GET['ip'];
	$file = fopen('ip.txt', 'w');
	fwrite($file, $ip);
	fclose($file);

	$result = array(
		'result' => 'success'
	);

finish:
	echo json_encode($result, JSON_UNESCAPED_SLASHES);
?>
