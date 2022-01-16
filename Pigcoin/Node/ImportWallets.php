<?
	// Connect to database
	$servername = "localhost";
    $username = "calmprep_anton";
    $password = "MySQL1@bbb";
    $dbname = "calmprep_pigcoin";

    $conn = new mysqli($servername, $username, $password, $dbname);
    
	if ($conn->connect_error) {
		echo('Connect error');
		exit();
    } 

	// Load wallets from file
	$adamJson = file_get_contents('Wallets/Adam.wallet');
	$adamData = json_decode($adamJson);

	$eveJson = file_get_contents('Wallets/Eve.wallet');
	$eveData = json_decode($eveJson);
    
	foreach (array($adamData, $eveData) as $wallet) {
		$sql = "SELECT id FROM wallets WHERE pubKey like '" . 
			$wallet->pubKey . "'";
		$res = $conn->query($sql);
    	if ($res->num_rows > 0) {
			echo("Wallet '{$wallet->name}' " . substr($wallet->pubKey, 0, 10) 
				. "... exists\n");
		} else {
    		$sql = "insert into wallets (name, email, pubKey) values "
				. "('{$wallet->name}', '{$wallet->email}', '{$wallet->pubKey}'";
			$res = $conn->query($sql);
			if (!$res) {
				echo("Error on insert: {$conn->error}\n");
			}
		}
	}
?>
