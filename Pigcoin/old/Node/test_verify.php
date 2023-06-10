<?
	require_once('NodeInfo.php');

	$keyJson = file_get_contents('Wallets/Adam.wallet');
	$keyData = json_decode($keyJson);
	
	echo $keyData->pubKey . "\n";
	$res = openssl_pkey_get_public(pemifyPublic($keyData->pubKey));
	if (!$res) {
		echo "Failed\n";
	} else {
		echo "Succeeded\n";
	}
	print_r($res);
	openssl_verify("", "", $keyData->pubKey, OPENSSL_ALGO_SHA256);

	$pem = openssl_pkey_get_details($ThisNodeInfo['key'])['key'];
	echo $pem;
?>
