<?
	header("content-type: application/json");

	$file = fopen('ip.txt', 'r');
	if (!$file) {
		$result = array(
			'result' => 'error',
			'reason' => 'No ip.txt file'
		);
		goto finish;
	}

	$ip = fgets($file);
	fclose($file);

	$result = array(
		'result' => 'success',
		'ip' => $ip
	);

finish:
	echo json_encode($result, JSON_UNESCAPED_SLASHES);
?>
