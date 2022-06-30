<?
	header("content-type: application/json");

	// Connect to mysql
	$servername = "localhost";
	$username = "calmprep_anton";
	$password = "MySQL1@bbb";
	$dbname = "calmprep_hunimal";

	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		$error = $conn->connect_error;
		goto after;
	}

/*
	// Check that the ip has not voted before
	$remote = $_SERVER['REMOTE_ADDR'];
	$port = $_SERVER['REMOTE_PORT'];
	$log = "$remote:$port";
	$log = $remote;

	$sql = 'select id from brochure_contest_ips where ip = ?;';
	$stmt = $conn->prepare($sql);
	if ($conn->error) {
		$error = $conn->error;
		goto after;
	}
	$stmt->bind_param('s', $log);
	$stmt->execute();
	$res = $stmt->get_result();
	if (!$res) {
		$error = $conn->error;
		goto after;
	}
	if ($res->num_rows > 0) {
		$error = 'User has already voted from this ip';
		goto after;
	}
*/

	// Validate recaptcha
	$sitekey = '6Lfas6IeAAAAAF2xcFZqf2cPBU2lQBB5GQAoTS2o';
	$secretkey = '6Lfas6IeAAAAABwITN4t6yyg0TQnAWngMROlo9gl';
	$token = $_GET['token'];
	$remote = $_SERVER['REMOTE_ADDR'];

	$postdata = http_build_query(
		array(
			'secret' => $secretkey,
			'response' => $token,
			'remoteip' => $remote
		)
	);

	$opts = array('http' => array(
		'method' => 'POST',
		'header' => 'content-type: application/x-www-form-urlencoded',
		'content' => $postdata
	));

	$context = stream_context_create($opts);
	$result = json_decode(file_get_contents(
		'https://www.google.com/recaptcha/api/siteverify', false, $context));
	/*$result = json_decode(file_get_contents('https://www.google.com/recaptcha/api/siteverify?'
		. "secret=$secretkey&response=$token"));*/

	if (!$result->success) {
		$error = json_encode($result->{'error-codes'});
		goto after;
	}

	// If user has not voted, create a cookie and add a new vote for them
	// If user has already voted, change their vote
	if (!isset($_COOKIE['brochure-contest-id'])) {
		$_COOKIE['brochure-contest-id'] = substr(md5(rand()), 0, 7);
		setcookie('brochure-contest-id', $_COOKIE['brochure-contest-id'], time()+1000*24*60*60, '/');
	}

	$sql = 'insert into brochure_contest_votes (cookie, brochure_id) values (?, ?)
		on duplicate key update brochure_id = ?;';
	$stmt = $conn->prepare($sql);
	if ($conn->error) {
		$error = $conn->error;
		goto after;
	}
	$stmt->bind_param('sii', $_COOKIE['brochure-contest-id'], $_GET['id'], $_GET['id']);
	$stmt->execute();
	if ($conn->error) {
		$error = $conn->error;
		goto after;
	}

/*
	// Try to update num votes (succeeds even if no ids match database)
	$sql = 'update brochure_contest set votes = votes + 1 where id = ?';
	$stmt = $conn->prepare($sql);
	if ($conn->error) {
		$error = $conn->error;
		goto after;
	}
	$stmt->bind_param('i', $_GET['id']);
	$stmt->execute();
	if ($conn->error) {
		$error = $conn->error;
		goto after;
	}
	
	// Add ip to the list of those that have voted
	$sql = 'insert into brochure_contest_ips (ip) values (?);';
	$stmt = $conn->prepare($sql);
	if ($conn->error) {
		$error = $conn->error;
		goto after;
	}
	$stmt->bind_param('s', $log);
	$stmt->execute();
	if ($conn->error) {
		$error = $conn->error;
		goto after;
	}
*/

after:
	echo json_encode(array('success' => !isset($error), 'error' => $error), JSON_UNESCAPED_SLASHES); 
?>
