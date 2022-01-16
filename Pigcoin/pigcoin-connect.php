<?
	// Connect to database
	$servername = "localhost";
    $username = "calmprep_anton";
    $password = "MySQL1@bbb";
    $dbname = "calmprep_pigcoin";

    $conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		echo('<span class="error">Database error</span>');
	}
?>
