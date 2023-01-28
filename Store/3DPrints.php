<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Store</title>
    <? include('generic.php'); ?>
	<link rel='stylesheet' href='style/store.css'>
	<link rel='stylesheet' href='style/Select.css'>
	<link rel='stylesheet' href='style/3DPrints.css'>
	<script src='script/3DPrints.js'></script>
	<script src='script/Select.js'></script>
</head>
<body>
    <h1>Hunimal Store: 3D Prints</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<? include('store-menu.php'); ?>
			<script src="https://www.paypal.com/sdk/js?client-id=Ac2kKDmIdhxeMckOR7-ZQxNbLkvPcNfQK_59t6QYF6Nvv55OxL7DQoZClegXHYRKJB8ceO6vjr7yUYds&currency=USD"></script>
			<h3>We Have 3D Prints Available!</h3>
			<div id='print-pics' style='float: right; width: 40%; min-width: 220px; text-align: right;'>
				<a href='image/good1.jpg'><img src='image/good1.jpg' width='200px' alt='Good prints 1'></a>
				<a href='image/good2.jpg'><img src='image/good2.jpg' width='200px' alt='Good prints 2'></a>
				<a href='image/fullset1.jpg'><img src='image/fullset1.jpg' width='200px' 
					alt='Full set in a single color'></a>
			</div>
			<div id='print-content' style='min-width: 400px;'>
				<p>These are Hunimal digits that David has printed out and can mail to you for cheap.
				They are about 2 inches across. Click on a picture to expand.</p>
				<h3>Buy Sets</h3>
				<p>You can buy an entire set for $<span class='hunimal-font'>
				<script>document.write(decimalToHunimalString(setCost) + 
				` (${setCost} USD, shipping included).`);</script>
				</span></p>
				<div class='custom-select-color hunimal-font' style='width: 200px; display: inline-block; 
						margin-bottom: 10px;'>
					<label for='setSelect'>Select Color</label>
					<select name='setSelect' id='setSelect'>
						<option value='Purple'>Purple</option>
						<option value='Yellow'>Yellow</option>
						<option value='Orange'>Orange</option>
						<option value='Green'>Green</option>
						<option value='Blue'>Blue</option>
						<option value='Pink'>Pink</option>
						<option value='Red'>Red</option>
					</select>
				</div>
				<input type='submit' id='addSetButton' value='Add to Cart'>
				<h3>Buy Individual Digits</h3>
				<p>Individual digits cost $<span class='hunimal-font'>
				<script>document.write(decimalToHunimalString(digitCost) + 
				` (${digitCost} USD).`);</script></p>
				<div class='custom-select-digit hunimal-font' style='width: 60px; display: inline-block;'>
					<label for='digitSelect'>Digit</label>
					<select name='digitSelect' id='digitSelect'></select>
				</div>
				<div class='custom-select-color hunimal-font' style='width: 200px; display: inline-block;'>
					<label for='digitColorSelect'>Select Color</label>
					<select name='digitColorSelect' id='digitColorSelect'>
						<option value='Purple'>Purple</option>
						<option value='Yellow'>Yellow</option>
						<option value='Orange'>Orange</option>
						<option value='Green'>Green</option>
						<option value='Blue'>Blue</option>
						<option value='Pink'>Pink</option>
						<option value='Red'>Red</option>
					</select>
				</div>
				<input type='submit' id='addDigitButton' value='Add to Cart'>
				<div id='cartDiv' style='display: none;'>
					<h3>Cart</h3>
					<div id='cartDivInner' style='font-size: 18px;' class='hunimal-font'></div>
					<p>(Click to remove)</p>
					<p>Total cost: $<span id='costSpan' class='hunimal-font'></span></p>
					<div id="paypal-button-container"></div>
				</div>
<!--<script>
paypal.Buttons({
	createOrder: function(data, actions) {
		return actions.order.create({
			purchase_units: [{
				amount: {
					value: getCost()
				}
			}]
		});
	},

	onClick: function(data, actions) {
		if (getCost() === 0) {
			return;
		}
		return fetch('Record.php', {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: cartJson()
		}).then(function(res) {
			return res.json();
		}).then(function(data) {
			if (data.error) {
				alert(data.error);
				// return actions.reject();
			} else {
				return actions.resolve();	
			}
		});
	},

	onApprove: function(data, actions) {
		return actions.order.capture().then(function(orderData) {
			let transaction = orderData.purchase_units[0].payments.captures[0];
			console.log(orderData);
			if (transaction.status == 'COMPLETED') {
				fetch('Record.php', {
					method: 'post',
					headers: {
						'content-type': 'application/json'
					},
					body: cartJson(orderData)
				}).then(res => {
					return res.json();
				}).then(data => {
					if (data.error) {
						alert(data.error);
					}
				});
				alert('Transaction successful');
			} else {
				alert('Transaction failed, check your PayPal email');
			}
		});
	}
}).render('#paypal-button-container');
</script>-->
			</div>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
