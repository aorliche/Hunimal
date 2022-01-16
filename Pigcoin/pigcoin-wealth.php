<?
	require_once('pigcoin-connect.php');

	$pigcoinWealth = null;

	$sql = "SELECT sum(balance) as wealth from wallets;";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$res = $stmt->get_result();
	if ($res) {
		$pigcoinWealth = $res->fetch_row()[0]/10000;
	}
?>
