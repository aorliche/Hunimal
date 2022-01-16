<? set_include_path('/home3/calmprepared/public_html/'); ?>
<? require_once('store-cart-cookies.php');?>
<?
	if ($_POST['digit-idx'] || $_POST['digit-idx'] === '0') {
		array_splice($cart_digits, intval($_POST['digit-idx']), 1);
		setcookie('cart-digits', implode(',', $cart_digits));
	}
	if ($_POST['set-idx'] || $_POST['set-idx'] === '0') {
		array_splice($cart_sets, intval($_POST['set-idx']), 1);
		setcookie('cart-sets', implode(',', $cart_sets));
	}
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
    <h1>Hunimal Store: Checkout</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<? include('store-menu.php'); ?>
<?
	if ($_GET['error']) {
		echo "<p style='background-color: #f88; padding: 5px'>".urldecode($_GET['error'])."</p>";
	}

	if ($_GET['nosets'] or $_GET['nodigits']) {
		echo "<p style='background-color: #f88; padding: 5px'>";
		if ($_GET['nosets']) {
			echo "We have insufficient digits for the following sets: ";
			echo implode(", ", explode(",", urldecode($_GET['nosets']))) . ".";
			if ($_GET['nodigits']) {
				echo '<br>';
			}
		}
		if ($_GET['nodigits']) {
			echo "We do not have enough of the following digits: ";
			$prettyDigits = array();
			foreach (explode(',', urldecode($_GET['nodigits'])) as $digitAndCol) {
				$digitAndColArr = explode('-', $digitAndCol);
				$dig = $digitAndColArr[0];
				$col = $digitAndColArr[1];
				$pretty = "<span class='hunimal-font' style='color: $col;'>$dig</span>";
				array_push($prettyDigits, $pretty);
			}
			echo implode(', ', $prettyDigits) . ".";
		}
	}
?>
			<h2>Cart</h2>
<?
	if (count($cart_sets) == 0 and count($cart_digits) == 0) {
		echo "<p>No items in cart</p>";
		goto endCart;
	}
?>
<!--<script src="https://www.paypal.com/sdk/js?client-id=AWOXfOdOjjkiPJdD5bB3V23y6ScER9nyFW-9I8jQUn-I1dqr5VCFkvimAOU4VAcVrNdhWhjDaNLgmitZ&currency=USD"></script>-->
<script src="https://www.paypal.com/sdk/js?client-id=Ac2kKDmIdhxeMckOR7-ZQxNbLkvPcNfQK_59t6QYF6Nvv55OxL7DQoZClegXHYRKJB8ceO6vjr7yUYds&currency=USD"></script>
			<p><a href='ClearCart.php'>Clear Cart</a></p>
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
		echo "<tr><td class='hunimal-font' style='color: $c;'>$d</td><td>$c</td><td>$1.00</td><td><button data-digit-idx='$i'>Remove</button></td></tr>";
		$i++;
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
		echo "<tr><td style='color: $set;'>$set</td><td>$50.00</td><td><button data-set-idx='$i'>Remove</button></td></tr>";
		$i++;
	}
?>
			</table>
<?
	endSets:
?>
	<h2>Checkout</h2>
			<p>Shipping: <strong>$5.00</strong></p>
			<p>Total: <strong style='color: red;'>$<span id='total-cost-span'><? printf("%.2f", $cost);?></span></strong></p>
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
		return fetch('Validate.php?sendjson=True', {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			}
		}).then(function(res) {
			return res.json();
		}).then(function(data) {
			if (data.validationError) {
				window.location.href = 'Checkout.php?' + data.errorQuery;
				// return actions.reject();
			} else if (data.errorError) {
				window.location.href = 'Checkout.php?error=' + encodeURIComponent(data.errorError);	
			} else {
				return actions.resolve();	
			}
		});
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
	<form id='complete-form' action='Complete.php' method='post'>
		<input type='hidden' name='order-data'>
		<input type='hidden' name='digits' value='<? echo implode(',', $cart_digits); ?>'>
		<input type='hidden' name='sets' value='<? echo implode(',', $cart_sets); ?>'>
		<input type='hidden' name='custom' value='no'>
		<input type='hidden' name='action' value='complete'>
	</form>
	<form action='Checkout.php' method='post' id='form-remove'>
		<input type='hidden' name='digit-idx'>
		<input type='hidden' name='set-idx'>
	</form>
<?
	endCart:
?>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
