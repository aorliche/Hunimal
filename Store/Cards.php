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
    <h1>Hunimal Store: Cards</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<? include('store-menu.php'); ?>
			<script src="https://www.paypal.com/sdk/js?client-id=Ac2kKDmIdhxeMckOR7-ZQxNbLkvPcNfQK_59t6QYF6Nvv55OxL7DQoZClegXHYRKJB8ceO6vjr7yUYds&currency=USD"></script>
            <p><u>Expect one to two weeks for shipping. We only ship to the United States.</u> Pay $10 for shipping.</p>
            <div id='designs'>
                <div class='design' style='width: 800px'>
                    <h3>Hunimal 107-Card Decks</h3>
                    <a href='image/cards-store.png'><img src='image/cards-store.png' width='300px' alt='Hunimal Cards Deck'></a>
                    <p>Order a custom hunimal deck with all numbers from zo to hun. Play regular card games with two copies of complete 52-card decks as well as special games with hunimal cards. Full design available <a href='https://www.canva.com/design/DAHCcdyrzPQ/7uWiYXU1HMyUOWkHvY3mAQ/edit?utm_content=DAHCcdyrzPQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton'>here</a>.</p>
                </div>
            </div>
            <p>Cost: <span id='deck-cost'>$<span class='hunimal-font'>&#x5520;</span> (20 USD) per pack + $<span class='hunimal-font'>&#x5510;</span> (10 USD shipping)</span></p>
            <p>Number:
            <select id='number'>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
            </p>
            <div id="paypal-button-container"></div>
<script>
const $ = (q) => document.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];
let key = null;

function randomKey() {
    return (Math.random() + 1).toString(36).substring(7);
}

function cartJson(orderData) {
    if (!orderData) {
        key = randomKey();
        orderData = null; // not 'undefined'
    }
    const cart = [];
    const numb = $('#number').selectedIndex + 1;
    cart.push(JSON.stringify({item: "107 card deck", numb}));
    const cost = 20*numb + 10;
    return JSON.stringify({cart: cart, cost: cost, key: key, orderData: orderData});
}

paypal.Buttons({
	createOrder: function(data, actions) {
        const numb = $('#number').selectedIndex + 1;
		return actions.order.create({
			purchase_units: [{
				amount: {
					value: 20*numb + 10
				}
			}]
		});
	},

	onClick: function(data, actions) {
		/*if (getCost() === 0) {
			return;
		}*/
		return fetch('RecordShirt.php', {
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
				fetch('RecordShirt.php', {
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
