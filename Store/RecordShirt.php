<?
	header("content-type: application/json");
	
    // Read packet
	$json = file_get_contents('php://input');
	$data = json_decode($json);

	// No error
	$error = null;
	
    if (!$data->key) {
		$error = "No key $data";
		goto finish;
	}

    $cart = $data->cart;
	
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

		$sql = "insert into store_shirt_orders (cart, email, address, paypal_tx_id, datakey) values (?, ?, ?, ?, ?)";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('sssss', implode(',',$cart), $email, $addrStr, $txid, $data->key);
		$stmt->execute();
		if ($conn->error) {
			$error = $conn->error;
			goto finish;
		}

		// Send email to me
		$to = "anton@hunimal.org";
		$subject = "Order Received Hunimal Shirt $txid";
		$message = "Received an order for\nShirt: ".implode(',',$cart).
			"\nMailing address: $addrStr\nEmail: $email\n";
		$headers = "From: no-reply@hunimal.org\r\nX-Mailer: PHP/".phpversion();
		mail($to, $subject, $message, $headers);

		// Send confirmation email
		$to = $email;
		$subject = "Hunimal.org: Order Received for Hunimal Shirt $txid";
		mail($to, $subject, $message, $headers);

	// Store
	} 

finish:
	$res = array('error' => $error);
	echo(json_encode($res, JSON_UNESCAPED_SLASHES));
?>
