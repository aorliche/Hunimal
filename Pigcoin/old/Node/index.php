<?
	header("content-type: application/json");

	// Read packet
	$json = file_get_contents('php://input');
	$data = json_decode($json);

	// Set up cryptography
	require_once('Error.php');
	require_once('NodeInfo.php');
   
   	// Connect to database
	$servername = "localhost";
    $username = "calmprep_anton";
    $password = "MySQL1@bbb";
    $dbname = "calmprep_pigcoin";

    $conn = new mysqli($servername, $username, $password, $dbname);
    
	if ($conn->connect_error) {
		$reply = makeError("Node database error", $ThisNodeInfo);
		echo($reply);
		exit();
    } 

	if ($data->type == 'GetWallets') {
		require_once('GetWallets.php');
	} else if ($data->type == 'Transaction') {
		require_once('Transaction.php');
	} else {
		$reply = makeError("Unkown request: '" . $data->type . "'", 
			$ThisNodeInfo);
		echo($reply);
	}
?>
