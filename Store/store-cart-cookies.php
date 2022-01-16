<?
	$cart_sets = array_filter(explode(',', $_COOKIE['cart-sets']));
	if ($_POST['action'] == 'set') {
		array_push($cart_sets, $_POST['color']);
		setcookie('cart-sets', implode(',', $cart_sets));
	}
	$cart_digits = array_filter(explode(',', $_COOKIE['cart-digits']));
	if ($_POST['action'] == 'digit') {
		array_push($cart_digits, $_POST['digit'].'='.$_POST['color']);
		setcookie('cart-digits', implode(',', $cart_digits));
	}
?>
