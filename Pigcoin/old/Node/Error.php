<?
	function signPacket(&$pkt, $info) {
		$json = json_encode($pkt, JSON_UNESCAPED_SLASHES);
		$sig = '';
		if (!openssl_sign($json, $sig, 
			$info['key'], OPENSSL_ALGO_SHA256)) {
			$pkt['msg'] = $msg . "\n" . openssl_error_string();
		} else {
			$pkt['sig'] = base64_encode($sig);
		}
	}

	function printOpensslErrors() {
		while (($err = openssl_error_string()) !== false) {
			echo($err."\n");
		}
	}

	function verifyTxnOrPacket($txn, $pubKey, $info) {
		$sigSav = $txn->sig;
		$sig = base64_decode($sigSav);
		$pubKeyPEM = $pubKey;
		if (strpos($pubKeyPEM, "-----BEGIN PUBLIC KEY-----\n") === false) {
			$pubKeyPEM = pemifyPublic($pubKey);
		}
		if (!($pubKeyStruct = openssl_pkey_get_public($pubKeyPEM))) {
			$reply = makeError("Bad pubKey: " . substr($pubKey,0,80) .
				"...", $info);
			echo $reply;
			exit();
		}
		$txn->sig = "";
		$json = json_encode($txn, JSON_UNESCAPED_SLASHES);
		$res = openssl_verify($json, $sig, $pubKeyStruct, OPENSSL_ALGO_SHA256);
		$txn->sig = $sigSav;
		return $res === 1;
	}

	function makeError($msg, $info) {
		$error = array(
			'msg' => $msg,
			'uri' => $info['uri'],
			'nonce' => genNonceString(),
			'pubKey' => $info['pubKey'],
			'sig' => '',
			'type' => 'Error' 
		);

		if (isset($info['key']) && $info['key'] != false) {
			signPacket($error, $info);
		}

		return json_encode($error, JSON_UNESCAPED_SLASHES);
	}

	function makeReply($succ, $msg, $nonce, $info) {
		$reply = array(
			'succ' => $succ,
			'msg' => $msg,
			'txnNonce' => $nonce,
			'uri' => $info['uri'],
			'nonce' => genNonceString(),
			'pubKey' => $info['pubKey'],
			'sig' => '',
			'type' => 'TransactionReply' 
		);
		
		if (isset($info['key']) && $info['key'] != false) {
			signPacket($reply, $info);
		}

		return json_encode($reply, JSON_UNESCAPED_SLASHES);
	}
?>
