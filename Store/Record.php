<?
	header("content-type: application/json");

	$setCost = 50;
	$digitCost = 1;

	// Read packet
	$json = file_get_contents('php://input');
	$data = json_decode($json);

	// No error
	$error = null;

	// Check cost
	// Convert to emailable-string
	$cost = 0;
	$cart = array();

	foreach ($data->cart as $item) {
		list($digit, $color) = explode('=', $item);
		$cp = mb_ord($digit);
		if ($digit != 'Set' and ($cp < 0x5500 or $cp > 0x5599)) {
			$error = "Bad digit $cp";
			goto finish;
		}
		if ($digit == 'Set') {
			$cost += $setCost;
		} else {
			$cost += $digitCost;
			$cp = $cp % 0x5500;
			$cp1 = $cp % 16;
			$cp10 = round($cp / 16);
			$digit = "$cp10$cp1";
		}
		array_push($cart, "$digit=$color");
	}

	if ($cost != $data->cost) {
		$error = "Bad cost " . $data->cost . " should be $cost";
		goto finish;
	}

	if (!$data->key) {
		$error = "No key $data";
		goto finish;
	}

	// Connect to database
	$servername = "localhost";
	$username = "calmprep_anton";
	$password = "MySQL1@bbb";
	$dbname = "calmprep_hunimal";

	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		$error = $conn->connect_error;
		goto finish;
	}

	// Commit
	if ($data->orderData) {
		// Get id and shipping info
		$json = $data->orderData;

		$txid = $json->id;
		$email = $json->payer->email_address;

		$amount = doubleval($json->purchase_units[0]->amount->value);

		$name = $json->purchase_units[0]->shipping->name->full_name;
		$addr1 = $json->purchase_units[0]->shipping->address->address_line_1;
		if (property_exists(
				$json->purchase_units[0]->shipping->address, 
				'address_line_2')) {
			$addr2 = $json->purchase_units[0]->shipping->address->address_line_2;
		}
		$city = $json->purchase_units[0]->shipping->address->admin_area_2;
		$state = $json->purchase_units[0]->shipping->address->admin_area_1;
		$zip = $json->purchase_units[0]->shipping->address->postal_code;
		$country = $json->purchase_units[0]->shipping->address->country_code;
		
		/*if ($country != "US") {
			$error = "We do not deliver outside the United States.";
			goto error;
		}*/

		$addrStr = $name."\n".$addr1;
		if (isset($addr2)) {
			$addrStr = $addrStr."\n".$addr2;
		}
		$addrStr = "$addrStr\n$city, $state $zip\n$country";

		$sql = "update new_store_3d_prints_orders set cart=?, email=?, address=?, amount=?, " .
			"paypal_tx_id=? where cart = ?;";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('sssdss', implode(',',$cart), $email, $addrStr, $amount, $txid, $data->key);
		$stmt->execute();
		if ($conn->error) {
			$error = $conn->error;
			goto finish;
		}
		if ($conn->affected_rows != 1) {
			$error = "Affected rows is ".strval($conn->affected_rows);
			goto finish;
		}

		// Send email to me
		$to = "anton@hunimal.org";
		$subject = "Order Received 3D Prints $txid";
		$message = "Received an order for\nPrints: ".implode(',',$cart).
			"\nMailing address: $addrStr\nEmail: $email\n";
		$headers = "From: no-reply@hunimal.org\r\nX-Mailer: PHP/".phpversion();
		mail($to, $subject, $message, $headers);

		// Send confirmation email
		$to = $email;
		$subject = "Hunimal.org: Order Received 3D Prints $txid";
		mail($to, $subject, $message, $headers);

	// Store
	} else {
		$sql = "insert into new_store_3d_prints_orders (cart, email, address, amount, " .
			"paypal_tx_id) values (?, 'temp', 'temp', ?, 'temp');";		
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('sd', $data->key, $data->cost);
		$stmt->execute();
		if ($conn->error) {
			$error = $conn->error;
			goto finish;
		}
		
	}

finish:
	$res = array('error' => $error);
	echo(json_encode($res, JSON_UNESCAPED_SLASHES));
?>
