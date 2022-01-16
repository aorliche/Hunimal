<? set_include_path('/home3/calmprepared/public_html/'); ?>
<?
	function toHunimalDigit($intDig) {
		$intDig = intval($intDig);
		$ones = $intDig % 10;
		$tens = intdiv($intDig, 10);
		return IntlChar::chr(0x5500 + $tens*16 + $ones);
	}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Store: Custom Order</title>
    <? include('generic.php'); ?>
	<link rel='stylesheet' href='style/store.css'>
	<!--<script src='script/ViewCart.js'></script>-->
</head>
<body>
    <h1>Hunimal Store: Custom Order</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
<?
	if (!isset($_GET['customid'])) {
		echo "<p class='error'>No custom order id.</p>";
		goto done;
	}
	$customId = $_GET['customid'];
	
	// Connect to mysql
	$servername = "localhost";
	$username = "calmprep_anton";
	$password = "MySQL1@bbb";
	$dbname = "calmprep_hunimal";

	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		$error = $conn->connect_error;
		echo "<p class='error'>Mysql error: $error.</p>";
		goto done;
	}
	
	$sql = "select cost,cart_digits,cart_sets,message,order_id from store_3d_prints_custom_orders where custom_id = ?;";
	$stmt = $conn->prepare($sql);
	$stmt->bind_param('s', $customId);
	$stmt->execute();
	if ($conn->error) {
		$error = $conn->error;
		echo "<p class='error'>Mysql error: $error.</p>";
		goto done;
	}
	$res = $stmt->get_result();

	$row = $res->fetch_assoc();
	if (!$row) {
		echo "<p class='error'>Invalid custom order id.</p>";
		goto done;
	}
	if ($row['order_id']) {
		echo "<p class='error'>Your payment has been processed. We should have your prints coming shortly. Check your email for confirmation!</p>";
	}

	$cart_digits = array_filter(explode(',', $row['cart_digits']));
	$cart_sets = array_filter(explode(',', $row['cart_sets']));

	// Convert cart digits to Hunimal font, which is what 
	// the other code expects
	$cart_digits_new = array();
	foreach ($cart_digits as $digit) {
		$dAndC = explode("=", $digit);
		$d = toHunimalDigit($dAndC[0]);
		$c = $dAndC[1];
		array_push($cart_digits_new, "$d=$c");
	}
	$cart_digits = $cart_digits_new;
	
?>	
	<h3>Your custom order</h3>
	<p>Message: <? echo $row['message']; ?></p>
	<p>Individual digits:</p>
	<table class='cart-table'>
		<tr><th>Digit</th><th>Color</th></tr>
<?
	$i = 0;
	foreach ($cart_digits as $digit) {
		$dAndC = explode("=", $digit);
		$d =$dAndC[0];
		$c = $dAndC[1];
		echo "<tr><td class='hunimal-font' style='color: $c;'>$d</td><td>$c</td></tr>";
		$i++;
	}
?>
	</table>
	<p>Whole sets:</p>
	<table class='cart-table'>
		<tr><th>Color</th></tr>
<?
	$i = 0;
	foreach ($cart_sets as $set) {
		echo "<tr><td style='color: $set;'>$set</td></tr>";
		$i++;
	}
?>
	</table>
	<p>Total: <strong style='color: red;'>$<span id='total-cost-span'><? printf("%.2f", $row['cost']);?></span></strong></p>
<?
	if ($row['order_id']) {
		goto done;
	}
?>
	<script src="https://www.paypal.com/sdk/js?client-id=Ac2kKDmIdhxeMckOR7-ZQxNbLkvPcNfQK_59t6QYF6Nvv55OxL7DQoZClegXHYRKJB8ceO6vjr7yUYds&currency=USD"></script>
	<div id="paypal-button-container"></div>
	<script>
paypal.Buttons({
	createOrder: function(data, actions) {
		return actions.order.create({
			purchase_units: [{
				amount: {
					value: document.getElementById('total-cost-span').innerText
				}
			}]
		});
	},

	onClick: function(data, actions) {
		return actions.resolve();	
	},

	onApprove: function(data, actions) {
		return actions.order.capture().then(function(orderData) {
			/* console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
			let transaction = orderData.purchase_units[0].payments.captures[0];
			alert('Transaction ' + transaction.status + ': ' + transaction.id + '\n\nSee console for all available details');*/
			let transaction = orderData.purchase_units[0].payments.captures[0];
			if (transaction.status == 'COMPLETED') {
				const form = document.querySelector('#complete-form');
				const formData = form.querySelector('input[name="order-data"]');
				formData.value = JSON.stringify(orderData);
				form.submit();
			} else {
				alert('Transaction failed, check your PayPal email');
			}
		});
	}
}).render('#paypal-button-container');
	</script>
<?
done:
?>
	<form id='complete-form' action='Complete.php' method='post'>
		<input type='hidden' name='order-data'>
		<input type='hidden' name='digits' value='<? echo implode(',', $cart_digits); ?>'>
		<input type='hidden' name='sets' value='<? echo implode(',', $cart_sets); ?>'>
		<input type='hidden' name='custom' value='yes'>
		<input type='hidden' name='custom-id' value='<? echo $customId; ?>'>
		<input type='hidden' name='action' value='complete'>
	</form>
	</div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
