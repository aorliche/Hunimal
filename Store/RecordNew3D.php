<?php
	header("content-type: application/json");

	// Read packet
	$json = file_get_contents('php://input');
	$data = json_decode($json);
	
    // No error
	$error = null;

    $n = $data->n;

    if (!$n or $n < 1 or $n > 10) {
        $error = 'Bad n: ' . $n;
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
			goto finish;
		}*/

		$addrStr = $name."\n".$addr1;
		if (isset($addr2)) {
			$addrStr = $addrStr."\n".$addr2;
		}
		$addrStr = "$addrStr\n$city, $state $zip\n$country";
		
        // Send email to me
		$to = "anton@hunimal.org";
		$subject = "Order 3D Prints Grab Bag $txid";
		$message = "Received an order for $n sets of 10 prints".
			"\nMailing address: $addrStr\nEmail: $email\n";
		$headers = "From: no-reply@hunimal.org\r\nX-Mailer: PHP/".phpversion();
		mail($to, $subject, $message, $headers);

		// Send confirmation email
		$to = $email;
		$subject = "Hunimal.org: Order Received 3D Prints $txid";
		mail($to, $subject, $message, $headers);
    }

finish:
    // Since I'm not checking by buying a set, send me an email if we blow up
    if ($error) {
		$to = "anton@hunimal.org";
		$subject = "Order 3D Prints Error";
		$message = $error;
		$headers = "From: no-reply@hunimal.org\r\nX-Mailer: PHP/".phpversion();
		mail($to, $subject, $message, $headers);
    }

	$res = array('error' => $error);
	echo(json_encode($res, JSON_UNESCAPED_SLASHES));
?>
