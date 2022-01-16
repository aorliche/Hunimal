<?
	require_once('Constants.php');
	require_once('Error.php');
	require_once('NodeInfo.php');

	function handleGenesis($data, $info, $conn) {
		$nonce = $data->txn->nonce;
		// Verify signature
		if (!verifyTxnOrPacket($data->txn, $data->txn->adamPubKey, $info)) {
			return makeReply(false, "Failed to verify transaction",
				$nonce, $info);
		}
		// Verify fields
		if (!is_numeric($data->txn->amount)) {
			return makeReply(false, "Non-numeric amount", $nonce, $info);
		}
		if ($data->txn->amount < MIN_GENESIS_BALANCE) {
			return makeReply(false,
				sprintf("Amount %.2d is less than minimum (%.2d)",
					$data->txn->amount, MIN_GENESIS_BALANCE), $nonce, $info);
		} 
		if ($data->txn->fee !== 0) {
			return makeReply(false, "Fee should be 0", $nonce, $info);
		}
		// Verify Adam public key
		$keyJson = file_get_contents('Wallets/Adam.wallet');
		$keyData = json_decode($keyJson);
		if ($keyData->pubKey != $data->txn->adamPubKey) {
			return makeReply(false, "Invalid Adam public key", 
				$nonce, $info);
		}
		// Find Adam wallet id 
		$sql = "SELECT id from wallets where pubKey=?;";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('s', $data->txn->adamPubKey);
		$stmt->execute();
		$res = $stmt->get_result();
		if (!$res) {
			return makeReply(false, "Database error on Adam wallet", 
				$nonce, $info);
		}
		if ($res->num_rows == 0) {
			return makeReply(false, "Adam wallet not in database", 
				$nonce, $info);
		}
		if ($res->num_rows > 1) {
			return makeReply(false, "Multiple Adam wallets in database", 
				$nonce, $info);
		}
		$adamId = $res->fetch_row()[0];
		// Find Eve wallet id (and create it if it does not exist)
		$inf = 0;
findEve:
		if ($inf == 2) {
			return makeReply(false, "Infinite goto in Eve wallet", 
				$nonce, $info);
		}
		$sql = "SELECT id,balance from wallets where pubKey=?;";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('s', $data->txn->evePubKey);
		$stmt->execute();
		$res = $stmt->get_result();
		if (!$res) {
			return makeReply(false, "Database error on Eve wallet", 
				$nonce, $info);
		}
		if ($res->num_rows > 1) {
			return makeReply(false, "Multiple Eve wallets in database", 
				$nonce, $info);
		}
		if ($res->num_rows == 0) {
			// Insert Eve wallet into database
			$sql = "INSERT into wallets (pubKey) values (?);";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param('s', $data->txn->evePubKey);
			if (!$stmt->execute()) {
				return makeReply(false, "Database error on adding eve wallet", 
					$nonce, $info);
			}
			$inf++;
			goto findEve;
		}
		$row = $res->fetch_row();
		$eveId = $row[0];
		$eveBal = $row[1]; 
		// Commit the transaction
		$sql = "INSERT INTO txnGen (adamId,eveId,amount,nonce,sig) " .
			"values (?,?,?,?,?);";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('iiiss', $adamId, $eveId, 
			$data->txn->amount, $nonce, $data->txn->sig);
		if (!$stmt->execute()) {
			return makeReply(false, "Database error commiting txn", 
				$nonce, $info);
		}
		// Update the balance
		// From here on out success is true because we have commited the txn
		$sql = "UPDATE wallets SET balance = ? where id = ?;";
		$stmt = $conn->prepare($sql);
		$newBal = $eveBal + $data->txn->amount;
		$stmt->bind_param('ii', $newBal, $eveId);
		if (!$stmt->execute()) {
			return makeReply(true, "Database error updating balance", 
				$nonce, $info);
		}
		// Send the success packet
		return makeReply(true, '', $data->txn->nonce, $info); 
	}
	
	function handleRegular($data, $info, $conn) {
		$txn = $data->txn;
		$nonce = $txn->nonce;
		$sendPubKey = $txn->sendPubKey;
		$recPubKey = $txn->recPubKey;
		$amount = intval($txn->amount);
		$fee = $txn->fee;
		$sig = $txn->sig;
		// Verify signature
		if (!verifyTxnOrPacket($txn, $sendPubKey, $info)) {
			return makeReply(false, "Failed to verify transaction",
				$nonce, $info);
		}
		// Verify positive amount
		if ($amount <= 0) {
			return makeReply(false, "Non-positive amount", $nonce, $info);
		}
		// Count number of nodes
		$sql = "SELECT count(id) from nodes;";
		$stmt = $conn->prepare($sql);
		$stmt->execute();
		$res = $stmt->get_result();
		if (!$res) {
			return makeReply(false, "Database error on counting # of nodes", 
				$nonce, $info);
		}
		$numNodes = $res->fetch_row()[0];
		if ($numNodes == 0) {
			return makeReply(false, "Node says there are 0 nodes!",
				$nonce, $info);
		}
		// Check fee is appropriate for amount
		$corFee = calcRegularFee($amount, $numNodes);
		if ($fee != $corFee) {
			return makeReply(false, sprintf(
				"Fee for amount %.2d should be %.2d but is %.2d",
				$amount, $fee, $corFee), $nonce, $info);
		}
		// Check that receiver is not replaying a transaction
		$sql = "SELECT count(id) from txnReg where nonce=?;";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('s', $nonce);
		$stmt->execute();
		$res = $stmt->get_result();
		if (!$res) {
			return makeReply(false, "Database error on counting # of prev txn", 
				$nonce, $info);
		}
		$numPrevTxn = $res->fetch_row()[0];
		if ($numPrevTxn == 1) {
			return makeReply(false, "Transaction replay detected!",
				$nonce, $info);
		} else if ($numPrevTxn > 1) {
			return makeReply(false, "Transaction replay and database error",
				$nonce, $info);
		}
		// Get sender info
		$sql = "SELECT id,balance from wallets where pubKey=?;";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('s', $sendPubKey);
		$stmt->execute();
		$res = $stmt->get_result();
		if (!$res) {
			return makeReply(false, "Database error on sender wallet", 
				$nonce, $info);
		}
		if ($res->num_rows == 0) {
			return makeReply(false, "Sender wallet not in database", 
				$nonce, $info);
		}
		if ($res->num_rows > 1) {
			return makeReply(false, "Multiple sender wallets in database", 
				$nonce, $info);
		}
		$row = $res->fetch_row();
		$sendId = $row[0];
		$sendBal = $row[1];
		// Verify send wallet has enough money
		if ($amount + $fee > $sendBal) {
			return makeReply(false, sprintf(
				"Insufficient funds: %.2d (amount) + %.2d (fee) > %.2d" .
				" (balance)", $amount, $fee, $sendBal), $nonce, $info);
		}
		// Find rec wallet id (and create it if it does not exist)
		$inf = 0;
findRec:
		if ($inf == 2) {
			return makeReply(false, "Infinite goto in receive wallet", 
				$nonce, $info);
		}
		$sql = "SELECT id,balance from wallets where pubKey=?;";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('s', $recPubKey);
		$stmt->execute();
		$res = $stmt->get_result();
		if (!$res) {
			return makeReply(false, "Database error on receive wallet", 
				$nonce, $info);
		}
		if ($res->num_rows > 1) {
			return makeReply(false, "Multiple receive wallets in database", 
				$nonce, $info);
		}
		if ($res->num_rows == 0) {
			// Insert receive wallet into database
			$sql = "INSERT into wallets (pubKey) values (?);";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param('s', $recPubKey);
			if (!$stmt->execute()) {
				return makeReply(false, 
					"Database error on adding receive wallet", 
					$nonce, $info);
			}
			$inf++;
			goto findRec;
		}
		$row = $res->fetch_row();
		$recId = $row[0];
		$recBal = $row[1]; 
		// Commit the transaction
		$sql = "INSERT INTO txnReg (sendId,recId,amount,fee,nonce,sig) "
			. "values (?,?,?,?,?,?);";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('iiiiss', $sendId, $recId, 
			$amount, $fee, $nonce, $sig);
		if (!$stmt->execute()) {
			print_r($conn->error);
			return makeReply(false, "Database error commiting txn", 
				$nonce, $info);
		}
		// Update the balance
		// From here on out success is true because we have commited the txn
		// Send balance
		$sql = "UPDATE wallets SET balance = ? where id = ?;";
		$stmt = $conn->prepare($sql);
		$newSendBal = $sendBal - $amount - $fee;
		$stmt->bind_param('ii', $newSendBal, $sendId);
		if (!$stmt->execute()) {
			return makeReply(true, "Database error send updating balance", 
				$nonce, $info);
		}
		// Rec balance
		$sql = "UPDATE wallets SET balance = ? where id = ?;";
		$stmt = $conn->prepare($sql);
		$newRecBal = $recBal + $amount;
		$stmt->bind_param('ii', $newRecBal, $recId);
		if (!$stmt->execute()) {
			return makeReply(true, "Database error send updating balance", 
				$nonce, $info);
		}
		// Add fee to nodes
		// Get nodes
		$sql = "SELECT walletId,wallets.balance FROM nodes "
			. "JOIN wallets on wallets.id = walletId;";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('s', $recPubKey);
		$stmt->execute();
		$res = $stmt->get_result();
		if (!$res) {
			return makeReply(true, "Database error on get nodes", 
				$nonce, $info);
		}
		if ($res->num_rows == 0) {
			return makeReply(true, "Found no nodes", $nonce, $info);
		}
		if ($res->num_rows != $numNodes) {
			return makeReply(true, "Disagreement on # of nodes", 
				$nonce, $info);
		}
		$feeSplit = $fee / $numNodes;
		$nodes = array();
		while ($row = $res->fetch_row()) {
			$nodeId = $row[0];
			$nodeBal = $row[1];
			$newNodeBal = $nodeBal + $feeSplit;
			$sql = "UPDATE wallets SET balance = ? where id = ?;";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param('ii', $newNodeBal, $nodeId);
			if (!$stmt->execute()) {
				return makeReply(true, "Database error updating "
					. "balance for node id $nodeId", $nonce, $info);
			}
		}
		// Send the success packet
		return makeReply(true, '', $nonce, $info); 
	}

	function handleTransaction($data, $info, $conn) {
		$type = $data->txn->type;
		if ($type == "Genesis") {
			$reply = handleGenesis($data, $info, $conn);
		} else if ($type == "Regular") {
			$reply = handleRegular($data, $info, $conn);
		} else {
			$reply = makeError("Unkown transaction type: '" . 
				$data->txn->type . "'", $info);
		}
		return $reply;
	}
	
	$reply = handleTransaction($data, $ThisNodeInfo, $conn);
	echo($reply);
?>
