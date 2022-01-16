<? set_include_path('/home3/calmprepared/public_html/'); ?>
<? require_once('store-cart-cookies.php');?>
<? require_once('Validate.php');?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Store</title>
    <? include('generic.php'); ?>
	<link rel='stylesheet' href='style/store.css'>
	<script src='script/3DPrints.js'></script>
</head>
<body>
    <h1>Hunimal Store: 3D Prints</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<? include('store-menu.php'); ?>
			<h3>We Have 3D Prints Available!</h3>
<?
	if (count($insufficientDigits) > 0 or count($insufficientSets) > 0) {
		echo "<p style='background-color: #f88; padding: 5px;'>We do not currently have enough of those in stock.</p>";
	}
?>
			<div id='print-content'>
				<div id='print-pics'>
					<a href='image/good1.jpg'><img src='image/good1.jpg' width='250px' alt='Good prints 1'></a>
					<a href='image/good2.jpg'><img src='image/good2.jpg' width='250px' alt='Good prints 2'></a>
					<a href='image/fullset1.jpg'><img src='image/fullset1.jpg' width='250px' alt='Full set in a single color'></a>
				</div>
				<p>These are Hunimal digits that David has printed out and can mail to you for cheap. They are about 2 inches across. Click on a picture to expand.</p>
				<form action='3DPrints.php' method='post' id='digit-form'>
					<label for='color'>Color:</label>
						<select name='color' id='color' form='digit-form'>
							<option value='Purple'>Purple</option>
							<option value='Yellow'>Yellow</option>
							<option value='Orange'>Orange</option>
							<option value='Green'>Green</option>
							<option value='Blue'>Blue</option>
							<option value='Pink'>Pink</option>
							<option value='Red'>Red</option>
						</select>
						<br>
					<label for='digit'>Digit:</label>
						<select name='digit' id='digit' form='digit-form' class='hunimal-font'>
						</select>
						<br>
					<label>Cost:</label> $<span class='hunimal-font'>&#x5501;.&#x5500;</span><br><br>
					<input type='hidden' name='action' value='digit'>
					<input type='submit' value='Add to Cart'>
				</form>
				<form action='3DPrints.php' method='post' id='set-form'>
					<p>You can also order an entire set!</p>
					<label for='color'>Color:</label>
						<select name='color' id='color' form='set-form'>
							<option value='Purple'>Purple</option>
							<option value='Yellow'>Yellow</option>
							<option value='Orange'>Orange</option>
							<option value='Green'>Green</option>
							<option value='Blue'>Blue</option>
							<option value='Pink'>Pink</option>
							<option value='Red'>Red</option>
						</select>
						<br>
					<label>Cost:</label>$<span class='hunimal-font'>&#x5550;.&#x5500;</span><br><br>
					<input type='hidden' name='action' value='set'>
					<input type='submit' value='Order an Entire Set'>
				</form>
			</div>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
