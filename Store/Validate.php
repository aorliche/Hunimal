<?
	require_once('store-cart-cookies.php');

	if ($_GET['sendjson']) {
		header('Content-Type: application/json; charset=utf-8');
	}

	$insufficientDigits = array();
	$insufficientSets = array();
	
	$new_cart_digits = array();
	$new_cart_sets = array();

	// Get available digits
	// Connect to mysql
	$servername = "localhost";
	$username = "calmprep_anton";
	$password = "MySQL1@bbb";
	$dbname = "calmprep_hunimal";

	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		$error = $conn->connect_error;
		$sendError = true;
		goto done;
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

	foreach ($cart_digits as $digit) {
		$dAndC = explode("=", $digit);
		$d = $dAndC[0];
		$c = $dAndC[1];
		$ord = mb_ord($d);
		$d0 = $ord%16;
		$d1 = ($ord/16)%16;
		$number = intval(round($d1*10 + $d0));
		$key = "$number.$c";
		$digitsAvailDict[$key] -= 1;
		if ($digitsAvailDict[$key] < 0) {
			array_push($insufficientDigits, $digit);
		} else {
			array_push($new_cart_digits, $digit);
		}
	}

	$cart_digits = $new_cart_digits;
	
	setcookie('cart-digits', implode(',', $cart_digits));

	foreach ($cart_sets as $set) {
		$avail = true;
		for ($i=0; $i<100; $i++) {
			$key = "$i.$set";
			$digitsAvailDict[$key] -= 1;
			if ($digitsAvailDict[$key] < 0) {
				array_push($insufficientSets, $set);
				$avail = false;
				break;
			} 
		}
		if ($avail) {
			array_push($new_cart_sets, $set);
		}
	}

	$cart_sets = $new_cart_sets;
	
	setcookie('cart-sets', implode(',', $cart_sets));

	if (!$_GET['sendjson']) {
		goto done;
	}

	if (count($insufficientDigits) > 0 || count($insufficientSets) > 0) {
		$digitsUrl = implode(',', $insufficientDigits);
		$digitsUrl = urlencode(str_replace("=", "-", $digitsUrl));
		$setsUrl = urlencode(implode(',', $insufficientSets));
		$url = "nosets=$setsUrl&nodigits=$digitsUrl";
		echo json_encode(array('validationError' => true, 'errorQuery' => $url));
	} else {
		echo json_encode(array('validationError' => false));
	}
done: 

	if ($_GET['sendjson'] and isset($sendError)) {
		echo json_encode(array('errorError' => $error));
	}
?>
