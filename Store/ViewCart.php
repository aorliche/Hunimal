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
    <h1>Hunimal Store: Cart</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<? include('store-menu.php'); ?>
			<h3>Cart</h3>
<?
	if (count($cart_sets) == 0 and count($cart_digits) == 0) {
		echo "<p>No items in cart</p>";
		goto endCart;
	}
?>
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
			<p>Total: <? printf("$%.2f", $cost);?></p>
			<p><a href='Checkout.php'>Go to Checkout</a></p>
			<form action='ViewCart.php' method='post' id='form-remove'>
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
