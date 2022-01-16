<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<link rel="icon" type="image/png" href="/image/H.png">
    <title>Hunimal Store Inventory Management</title>
	<script src='script/index.js'></script>
	<link rel="icon" type="image/png" href="/image/H.png">
	<style>
@font-face {
	font-family: "HunimalSansv1.5";
	src: url('/Hunimal/Font/font/HunimalSansv1.5.ttf');
}
.hunimal-font {
	font-family: "HunimalSansv1.5";
}
#digits-div {
	height: 400px;
	overflow-y: scroll;
}
	</style>
</head>
<body>
    <h1>Hunimal Store Inventory</h1>
<?
	// Connect to mysql
	$servername = "localhost";
	$username = "calmprep_anton";
	$password = "MySQL1@bbb";
	$dbname = "calmprep_hunimal";

	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		$error = $conn->connect_error;
		goto error;
	}

	if ($_POST['action'] == 'set-sent') {
		$sql = "update store_3d_prints_orders set sent = 1 where id = ?;";
		$stmt = $conn->prepare($sql);
		$id = intval($_POST['order-id']);
		$stmt->bind_param('i', $id);
		$stmt->execute();
		if ($conn->error) {
			$error = $conn->error;
			goto error;
		}
	}
	
	$sql = "select id,number,color,available from store_3d_prints;";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$resRequests = $stmt->get_result();

	// Build availability dictionary
	$digitsAvailDict = array();
	while ($row = $resRequests->fetch_row()) {
		$num = $row[1];
		$col = $row[2];
		$avail = $row[3];
		$key = "$num.$col";
		$digitsAvailDict[$key] = $avail;
	}
	
	// Check for inventory changes
	if (!isset($_POST['action'])) {
		goto nopost;
	}

	if ($_POST['action'] == 'add-set' or $_POST['action'] == 'remove-set') {
		$delta = $_POST['action'] == 'add-set' ? 1 : -1;
		$col = $_POST['color'];
		for ($i = 0; $i < 100; $i++) {
			$sql = "update store_3d_prints set available = ? where number = ? and color = ?;";
			$stmt = $conn->prepare($sql);
			$key = "$i.$col";
			$newAvail = $digitsAvailDict[$key]+$delta;
			$stmt->bind_param('iis', $newAvail, $i, $col);
			$stmt->execute();
			if ($conn->error) {
				$error = $conn->error;
				goto error;
			}
			// update availability dict
			$digitsAvailDict[$key] = $newAvail;
		}
	}

	if ($_POST['action'] == 'add-digit' or $_POST['action'] == 'remove-digit') {
		$col = $_POST['color'];
		$digit = intval($_POST['digit']);
		$key = "$digit.$col";
		$delta = $_POST['action'] == 'add-digit' ? 1 : -1;
		$delta *= intval($_POST['digit-quantity']);
		$avail = intval($digitsAvailDict[$key]);
		if ($avail+$delta < 0) {
			$delta = -$avail;
		}
		$sql = "update store_3d_prints set available = ? where number = ? and color = ?;";
		$stmt = $conn->prepare($sql);
		$newAvail = $digitsAvailDict[$key]+$delta;
		$stmt->bind_param('iis', $newAvail, $digit, $col);
		$stmt->execute();
		if ($conn->error) {
			$error = $conn->error;
			goto error;
		}

		// update availability dict
		$digitsAvailDict[$key] = $newAvail;
	}

nopost:
?>
	<div style='float: left; position: relative; top: -24px;'>
	<h2>Digits Availability</h2>
	<form id="add-set-form" action="." method="post">
		<input type="hidden" name="action" value="add-set">
		<select name='color' form='add-set-form'>
			<option value='Purple'>Purple</option>
			<option value='Yellow'>Yellow</option>
			<option value='Orange'>Orange</option>
			<option value='Green'>Green</option>
			<option value='Blue'>Blue</option>
			<option value='Pink'>Pink</option>
			<option value='Red'>Red</option>
		</select>
		<input type='submit' value='Add Set'>
	</form>
	<form id="remove-set-form" action="." method="post">
		<input type="hidden" name="action" value="remove-set">
		<select name='color' form='remove-set-form'>
			<option value='Purple'>Purple</option>
			<option value='Yellow'>Yellow</option>
			<option value='Orange'>Orange</option>
			<option value='Green'>Green</option>
			<option value='Blue'>Blue</option>
			<option value='Pink'>Pink</option>
			<option value='Red'>Red</option>
		</select>
		<input type='submit' value='Remove Set'>
	</form>
	<form id="add-digit-form" action="." method="post">
		<input type="hidden" name="action" value="add-digit">
		<select class='hunimal-font' name='digit' form='add-digit-form'>
		</select>
		<select name='color' form='add-digit-form'>
			<option value='Purple'>Purple</option>
			<option value='Yellow'>Yellow</option>
			<option value='Orange'>Orange</option>
			<option value='Green'>Green</option>
			<option value='Blue'>Blue</option>
			<option value='Pink'>Pink</option>
			<option value='Red'>Red</option>
		</select>
		<input type='text' size='5' name='digit-quantity' value='1'>
		<input type='submit' value='Add Digit'>
	</form>
	<form id="remove-digit-form" action="." method="post">
		<input type="hidden" name="action" value="remove-digit">
		<select class='hunimal-font' name='digit' form='remove-digit-form'>
		</select>
		<select name='color' form='remove-digit-form'>
			<option value='Purple'>Purple</option>
			<option value='Yellow'>Yellow</option>
			<option value='Orange'>Orange</option>
			<option value='Green'>Green</option>
			<option value='Blue'>Blue</option>
			<option value='Pink'>Pink</option>
			<option value='Red'>Red</option>
		</select>
		<input type='text' size='5' name='digit-quantity' value='1'>
		<input type='submit' value='Remove Digit'>
	</form>
	<br>
	<div id='digits-div'>
	<table id='digits'>
<?
	$colors = array('Purple', 'Yellow', 'Orange', 'Green', 'Blue', 'Pink', 'Red');

	echo "<tr><th>Digit</th>";
	foreach ($colors as $color) {
		echo "<th>$color</th>";
	}
	echo "</tr>";

	for ($i=0; $i<100; $i++) {
		echo "<tr><td>$i</td>";
		foreach ($colors as $color) {
			$key = "$i.$color";
			$avail = $digitsAvailDict[$key];
			if (!$avail) {
				echo "<td style='color: $color;'>0</td>";
			} else {
				echo "<td style='color: $color;'>$avail</td>";
			}
		}
		echo "</tr>";
	}
?>
	</table>
	</div>
	</div>
	<div style='margin-left: 400px;'>
	<h2>Orders</h2>
	<p>
	<form action='.' method='post'>
		<input type='hidden' name='view-all' value='view-all'>
		<input type='submit' value='View All Previous Txns'>
	</form>
	<form action='.' method='post'>
		<input type='hidden' name='view-all' value='no-view-all'>
		<input type='submit' value='View Unsent Only'>
	</form>
	</p>
<?
	$sql = "select id,name,address,ts,amount,paypal_tx_id,sent,email from store_3d_prints_orders;";
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	$resOrders = $stmt->get_result();

	$numOrders = 0;
	while ($row = $resOrders->fetch_assoc()) {
		if (!$row['sent']) {
			echo "<p><span style='color: red; font-weight: bold;'>Not sent</span><button data-send-order='".$row['id']."'>Mark sent</button><br>\n";
		} else {
			if ($_POST['view-all'] != 'view-all') {
				continue;
			}
			echo "<p>Sent!<br>\n";
		}
		echo "Name: ".$row['name']."<br>\n";
		echo "Address: <pre>\n".$row['address']."</pre><br>\n";
		echo "Date: ".$row['ts']."<br>\n";
		echo "Paypal TX ID: ".$row['paypal_tx_id']."<br>\n";
		echo "Email: ".$row['email']."</p>\n";

		$sql = "select whole_set, number, color from store_3d_prints_orders_digits where order_id = ?;";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('i', $row['id']);
		$stmt->execute();
		if ($conn->error) {
			$error = $conn->error;
			goto error;
		}
		$resDigits = $stmt->get_result();

		echo "<p>Order for the following digits/sets: ";
		$first = true;
		while ($rowDig = $resDigits->fetch_assoc()) {
			if (!$first) {
				echo ", ";
			}
			$first = false;
			if ($rowDig['whole_set']) {
				echo "[whole set, color=".$rowDig['color']."]";
			} else {
				echo "[digit ".$rowDig['number'].", color=".$rowDig['color']."]";
			}
		}
		echo "</p>";

		$numOrders++;
	}
	if ($numOrders == 0) {
		echo "<p>No orders</p>";
	}
?>
	</div>
	<form id='set-sent-form' action='.' method='post'>
		<input type='hidden' name='action' value='set-sent'>
		<input type='hidden' name='order-id'>
	</form>
<?
error:
	if ($error) {
		echo "<p style='color: #22f; font-weight: bold;'>".htmlspecialchars($error)."</p>";
	}
?>
</body>
</html>
