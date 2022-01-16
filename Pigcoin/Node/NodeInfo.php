<?
	require_once('Error.php');

	function pemifyPrivate($privKeyPkcs8) {
		return 
			"-----BEGIN ENCRYPTED PRIVATE KEY-----\n" .
			$privKeyPkcs8 . "\n" .
			"-----END ENCRYPTED PRIVATE KEY-----";
	}

	function pemifyPublic($pubKey) {
		return 
			"-----BEGIN PUBLIC KEY-----\n" .
			$pubKey . "\n" . 
			"-----END PUBLIC KEY-----";
	}

	function getThisNodeInfo() {
		$info = array();
		
		// Node URI
		$info['uri'] = 'https://hunimal.org/Pigcoin/Node/';

		// Node key info
		$keyPass = 'eveeveeve';
		$keyJson = file_get_contents('Wallets/Eve.wallet');
		$keyData = json_decode($keyJson);

		$info['name'] = $keyData->name;
		$info['email'] = $keyData->email;
		$info['pubKey'] = $keyData->pubKey;
		$info['privKeyPkcs8'] = $keyData->privKeyPkcs8;

		$info['key'] = 
			openssl_pkey_get_private(
				pemifyPrivate($keyData->privKeyPkcs8), $keyPass);

		if (!$info['key']) {
			$error = makeError(openssl_error_string(), $info);
			echo($error);
			exit();
		}

		return $info;
	}

	$ThisNodeInfo = getThisNodeInfo();
?>
