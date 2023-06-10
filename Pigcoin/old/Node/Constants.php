<?
	const KEY_SIZE = 2048;
	const NONCE_BYTES = 8;

	// Changeable protocol parameters
	const MIN_GENESIS_AMOUNT = 100*100;
	const MIN_TXN_FEE = 10*100;
	const MAX_TXN_FEE = 1000*100;
	const TXN_FEE_FRACTION = 0.02; // 2% Transaction fee

	function genNonceString() {
		return base64_encode(random_bytes(NONCE_BYTES));
	}

	function calcRegularFee($amount, $nNodes) {
		$fee = $amount*TXN_FEE_FRACTION;
		if ($fee > MAX_TXN_FEE) $fee = MAX_TXN_FEE;
		else if ($fee < MIN_TXN_FEE) $fee = MIN_TXN_FEE;
		return intval($nNodes*intval((intval($fee) / $nNodes)));
	}

?>
