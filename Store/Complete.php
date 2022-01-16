<? set_include_path('/home3/calmprepared/public_html/'); ?>
<?
	setcookie('cart-digits', '');
	setcookie('cart-sets', '');

	require_once('store-cart-cookies.php');

	$cart_digits = array_filter(explode(',', $_POST['digits']));
	$cart_sets = array_filter(explode(',', $_POST['sets']));
?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Store: Cart</title>
    <? include('generic.php'); ?>
	<link rel='stylesheet' href='style/store.css'>
	<script src='script/ViewCart.js'></script>
</head>
<body>
    <h1>Hunimal Store: Purchase Complete!</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
<?
	if ($_POST['action'] == 'complete') {

		// Parse cart digits and sets
		if (!$_POST['digits'] and !$_POST['sets']) {
			$error = "No cart digits or sets";
			goto error;
		}

		// Get id and shipping info
		$json = json_decode($_POST['order-data']);

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
			$error = "We do not deliver outside the United States. You should receive a refund within the next day.";
			goto error;
		}*/

		$addrStr = $name."\n".$addr1;
		if (isset($addr2)) {
			$addrStr = $addrStr."\n".$addr2;
		}
		$addrStr = $addrStr."\n".$city.", ".$state." ".$zip."\n";
	
		// Connect to database
		$servername = "localhost";
		$username = "calmprep_anton";
		$password = "MySQL1@bbb";
		$dbname = "calmprep_hunimal";

		$conn = new mysqli($servername, $username, $password, $dbname);

		if ($conn->connect_error) {
			$error = $conn->connect_error;
			goto error;
		}

		// Update database
		// Update order
		$sql = "insert into store_3d_prints_orders (name, address, amount, paypal_tx_id, email, orderData) values (?, ?, ?, ?, ?, ?);";		
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('ssdsss', $name, $addrStr, $amount, $txid, $email, $_POST['order-data']);
		$stmt->execute();
		if ($conn->error) {
			$error = $conn->error;
			goto error;
		}

		// Get order id
		$sql = "select id from store_3d_prints_orders where paypal_tx_id = ?;";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('s', $txid);
		$stmt->execute();
		if ($conn->error) {
			$error = $conn->error;
			goto error;
		}
		$resOrder = $stmt->get_result();

		$numOrders = 0;
		while ($row = $resOrder->fetch_row()) {
			$orderId = $row[0];
			$numOrders++;
		}

		if ($numOrders != 1) {
			$error = "Multiple or zero orders: $numOrders";
			goto error;
		}

		// update custom order id
		if ($_POST['custom'] === 'yes') {
			$sql = "update store_3d_prints_custom_orders set order_id = ? where custom_id = ?;";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param('is', $orderId, $_POST['custom-id']);
			$stmt->execute();
			if ($conn->error) {
				$error = $conn->error;
				goto error;
			}

			// skip updating digits and sets
			goto finish_update_digits_sets;
		}

		// Update digits in this order
		foreach ($cart_digits as $digit) {
			$dAndC = explode("=", $digit);
			$d = $dAndC[0];
			$c = $dAndC[1];
			$ord = mb_ord($d);
			$d0 = $ord%16;
			$d1 = ($ord/16)%16;
			$number = intval(round($d1*10 + $d0));

			// Update digits in order...
			$sql = "insert into store_3d_prints_orders_digits (order_id, number, color) values (?, ?, ?);";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param('iis', $orderId, $number, $c);
			$stmt->execute();
			if ($conn->error) {
				$error = $conn->error;
				goto error;
			}

			//... update available digits
			$sql = "update store_3d_prints set available = available - 1 where number = ? and color = ?;";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param('is', $number, $c);
			$stmt->execute();
			if ($conn->error) {
				$error = $conn->error;
				goto error;
			}
		}

		// Update sets in this order
		foreach ($cart_sets as $set) {
			// Update sets in this order...
			$one = 1;
			$sql = "insert into store_3d_prints_orders_digits (order_id, whole_set, color) values (?, ?, ?);";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param('iis', $orderId, $one, $set);
			$stmt->execute();
			if ($conn->error) {
				$error = $conn->error;
				goto error;
			}

			// ... And update availability of all digits
			for ($i = 0; $i < 100; $i++) {
				$sql = "update store_3d_prints set available = available - 1 where number = ? and color = ?;";
				$stmt = $conn->prepare($sql);
				$stmt->bind_param('is', $i, $set);
				$stmt->execute();
				if ($conn->error) {
					$error = $conn->error;
					goto error;
				}
			}	
		}

finish_update_digits_sets:

		// Convert cart digits into ordinary numbers
		$regDigitsAndColors = array();
		foreach ($cart_digits as $digAndColor) {
			$digAndColorArr = explode('=', $digAndColor);
			$dig = $digAndColorArr[0];
			$col = $digAndColorArr[1];
			$ord = mb_ord($dig);
			$d0 = $ord%16;
			$d1 = ($ord/16)%16;
			$number = intval(round($d1*10 + $d0));
			array_push($regDigitsAndColors, sprintf("%d=%s", $number, $col));
		}
		
		// Send email to me, David, and David's main email
		$to = "anton@hunimal.org";
		$subject = "Order Received 3D Prints $txid";
		$message = "Received an order for\nDigits: ".implode(',',$regDigitsAndColors)."\nSets: ".implode(',',$cart_sets)."\nMailing address: $addrStr\nEmail: $email\n";
		$headers = "From: no-reply@hunimal.org\r\nX-Mailer: PHP/".phpversion();
		mail($to, $subject, $message, $headers);

		$to = "david@hunimal.org";
		mail($to, $subject, $message, $headers);

		$to = "calmprepared@gmail.com";
		mail($to, $subject, $message, $headers);

		// Send confirmation email
		$to = $email;
		$subject = "Hunimal.org: Order Received 3D Prints $txid";
		mail($to, $subject, $message, $headers);

	} else {
		$error = "Error in processing transaction";
		goto error;
	}

	$sav_cart_digits = $cart_digits;
	$sav_cart_sets = $cart_sets;

	$cart_digits = array();
	$cart_sets = array();
?>
			<? include('store-menu.php'); ?>
<?
	$cart_digits = $sav_cart_digits;
	$cart_sets = $sav_cart_sets;
	$cost = 0;
?>
			<h2>Purchase Complete</h2>
			<p>Thank you for your purchase! I will send your items as soon as possible and they should arrive within about a week's time.</p>
			<h3>Shipping Address</h3>
			<p><pre><? echo $addrStr?></pre></p>
			<p>A confirmation email has been sent to <? echo htmlspecialchars($email); ?></p>
			<h3>Items</h3>
<?
	if (count($cart_digits) == 0) {
		goto endDigits;
	}
?>
			<p>Individual digits:</p>
			<table class='cart-table'>
				<tr><th>Digit</th><th>Color</th><th>Cost</th></tr>
<?
	$i = 0;
	foreach ($cart_digits as $digit) {
		$dAndC = explode("=", $digit);
		$d = $dAndC[0];
		$c = $dAndC[1];
		echo "<tr><td class='hunimal-font' style='color: $c;'>$d</td><td>$c</td><td>$1.00</td></tr>";
		$i++;
		$cost += 1;
	}
?>
			</table>
<?
	endDigits:
	if (count($cart_sets) == 0) {
		goto endSets;
	}
?>
			<p>Whole sets:</p>
			<table class='cart-table'>
				<tr><th>Color</th><th>Cost</th></tr>
<?
	$i = 0;
	foreach ($cart_sets as $set) {
		echo "<tr><td style='color: $set;'>$set</td><td>$50.00</td></tr>";
		$i++;
		$cost += 50;
	}
?>
			</table>
<?
endSets:
	if ($cost > 0) {
		$cost += 5;
	}

	if ($_POST['custom'] === 'yes') {
		echo "<p>Total: <strong style='color: red;'>$<span id='total-cost-span'>$amount</span></strong></p>";
	} else {
?>
	<p>Shipping: <strong>$5.00</strong></p>
	<p>Total: <strong style='color: red;'>$<span id='total-cost-span'><? printf("%.2f", $cost);?></span></strong></p>
<?
	}
?>
	<h3>Thank you for your purchase!</p>
<?
	error:
	if (isset($error)) {
		echo "<h3>Error</h3>";
		echo "<p style='background-color: #f22; padding: 5px;'>".htmlspecialchars($error)."</p>";
	}
?>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
