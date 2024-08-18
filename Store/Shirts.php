<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Store</title>
    <? include('generic.php'); ?>
	<link rel='stylesheet' href='style/store.css'>
	<link rel='stylesheet' href='style/Shirts.css'>
</head>
<body>
    <h1>Hunimal Store: Shirts</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<? include('store-menu.php'); ?>
			<script src="https://www.paypal.com/sdk/js?client-id=Ac2kKDmIdhxeMckOR7-ZQxNbLkvPcNfQK_59t6QYF6Nvv55OxL7DQoZClegXHYRKJB8ceO6vjr7yUYds&currency=USD"></script>
            <p><u>Expect one week for shipping. We only ship to the United States.</u></p>
            <div id='designs'>
                <div class='design'>
                    <h3>Design 1: Pig and Gator Friendship</h3>
                    <a href='image/Design1.png'><img src='image/Design1.png' width='300px' alt='Design1'></a>
                    <p>A pig and gator showing their friendship in front of a random MSP.</p>
                </div>
                <div class='design'>
                    <h3>Design 2: David</h3>
                    <a href='image/Design2.png'><img src='image/Design2.png' width='300px' alt='Design2'></a>
                    <p>A photo of David, creator of the Hunimal system.</p>
                </div>
                <div class='design'>
                    <h3>Design 3: Cool Amerindian Design</h3>
                    <a href='image/Design3.png'><img src='image/Design3.png' width='300px' alt='Design3'></a>
                    <p>A cool design inspired by the American Southwest.</p>
                </div>
            </div>
            <p>Cost: $<span class='hunimal-font'>&#x5535;</span> (35 USD)<p>
            <p>Size: 
                <select>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                </select>
                Design to Buy:
                <select>
                    <option>Design 1</option>
                    <option>Design 2</option>
                    <option>Design 3</option>
                </select>
            </p>
            <div id="paypal-button-container"></div>
<script>
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
</script>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
