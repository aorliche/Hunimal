<? set_include_path('/home3/calmprepared/public_html/'); ?>
<?
	$title = 'Brochure Contest: Post Submission';

	// Check that we have name, email, and confirm-email data
	if (!isset($_POST['name']) or !isset($_POST['email']) or !isset($_POST['confirm-email'])) {
		$error = 'Unset fields';
		goto after;
	}

	// Check valid image
	$check = getimagesize($_FILES['brochure']['tmp_name']);
	if (!$check) {
		$error = 'Invalid image';
		goto after;
	}

	$maxSize = 5_000_000;
	$fs = filesize($_FILES['brochure']['tmp_name']);
	if ($fs > $maxSize) {
		$error = "Max image size $maxSize, you uploaded $fs";
		goto after;
	}

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

	// Try to update name and email info, set num votes to zero
	$sql = 'insert into brochure_contest (name, email, votes) values (?, ?, 0);';
	$stmt = $conn->prepare($sql);
	if ($conn->error) {
		$error = $conn->error;
		goto after;
	}
	$stmt->bind_param('ss', $_POST['name'], $_POST['email']);
	$stmt->execute();
	if ($conn->error) {
		$error = $conn->error;
		goto after;
	}

	// Copy file to permanent directory
	$fname = 'brochures/' . $conn->insert_id 
		. '.' . end((explode('.', $_FILES['brochure']['name'])));
	if (!move_uploaded_file($_FILES['brochure']['tmp_name'], $fname)) {
		$error = 'Error moving uploaded file';
		goto after;
	}

after:
?>
<!DOCTYPE html>
<html>
<head>
    <title><? echo $title; ?></title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<!--<link rel="stylesheet" href="style/index.css">
	<script src="script/index.js"></script>-->
</head>
<body>
    <h1><? echo $title; ?></h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
<? 
	if (isset($error)) {
?>
		<h2>Error</h2>
		<p>Submission not successful: <? echo $error; ?></p>
		<p><a href='Submit.php'>Back to submit page</a></p>
<?
	} else {
?>
		<h2>Success!</h2>
		<p>Your submission has been received.</p>
		<p><a href='Gallery.php'>View all submissions</a></p>
<?
	}
?>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
