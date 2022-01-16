<?
	require_once('Constants.php');
	require_once('Error.php');
	require_once('NodeInfo.php');

	//$data = (object)array('balLow' => 0);

	function makeGetWalletsReply($data, $info, $conn) {
		// Connect to database if not connected
		if (!$conn) {
			$servername = "localhost";
			$username = "calmprep_anton";
			$password = "MySQL1@bbb";
			$dbname = "calmprep_pigcoin";

			$conn = new mysqli($servername, $username, $password, $dbname);
			
			if ($conn->connect_error) {
				$reply = makeError("Node database error", $info);
				echo($reply);
				exit();
			} 
		}

		$pubKeys = $data->pubKeys;
		
		$resPacket = array(
			'wallets' => array(),
			'uri' => $info['uri'],
			'nonce' => genNonceString(),
			'pubKey' => $info['pubKey'],
			'sig' => '',
			'type' => 'WalletList'
		);

		foreach ($pubKeys as $key) {
			$sql = "Select name,email,pubKey,balance from wallets where " .
				"pubKey like ?;";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param('s', $key);
			$stmt->execute();
			$res = $stmt->get_result();
			if (!$res) {
				$reply = makeError("Node database error", $info);
				echo($reply);
				exit();
			}
			$rows = $res->fetch_all();
			foreach ($rows as $row) {
				array_push($resPacket['wallets'], array(
					'name' => $row[0],
					'email' => $row[1],
					'pubKey' => $row[2],
					'privKeyPkcs8' => '',
					'balance' => $row[3]
				));
			}
		}

		signPacket($resPacket, $info);

		return json_encode($resPacket, JSON_UNESCAPED_SLASHES);
	}

	$reply = makeGetWalletsReply($data, $ThisNodeInfo, $conn);
	echo($reply);
?>
