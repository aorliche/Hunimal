<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Store</title>
    <? include('generic.php'); ?>
	<link rel='stylesheet' href='style/store.css'>
	<script src='script/store.js'></script>
</head>
<body>
    <h1>Hunimal Store: Shirts, 3D Prints, and Crypto</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<? include('store-menu.php'); ?>
			<h2>Welcome to the hunimal store!</h2>
			<div id='store-items' style='min-width: 700px;'>
                <div class='item' data-available>
                    <div class='item-data'>
                        <img class='pic' src='image/Design3.png' height='96' alt='Hunimal Shirt Design'>
                        <div class='title'>
                            <a href='Shirts.php' style='color: white;'>Hunimal Shirts and Hats</a>
                        </div>
                        <div class='price'>
                            Price: $<span class='hunimal-font'>&#x5535;.&#x5500;</span> per Shirt
                            <!--Price: $<span class='hunimal-font'>&#x5542;.&#x5500;</span> per Hat-->
                        </div>
                        <div class='desc'>
                            Custom hunimal shirts with several designs. Available in S,M,L,XL sizes.
                        </div>
                    </div>
                </div>
				<div class='item' data-coming-soon>
					<div class='item-data'>
						<img class='pic' src='image/hun-print-icon1.jpg' height='96' alt='Hunimal 3D Prints'>
						<div class='title'>
							<a href="">2-Inch Hunimal 3D Prints</a>
						</div>
						<div class='price'>
							Price: $<span class='hunimal-font'>&#x5501;.&#x5500;</span> per 1 Digit
						</div>
						<div class='desc'>
							3D Printed Hunimal digits from <span class='hunimal-font'>&#x5500;-&#x5599;</span> that are about 2 inches in size. Multiple colors available. Limited supply.
						</div>
					</div>
					<div class='coming-soon'>
					    Sold out!
					</div>
				</div>
				<div class='item' data-coming-soon>
					<div class='item-data'>
						<img class='pic' src='image/pig96.png' alt='Pigcoin Pig $$'>
						<div class='title'>
							<a href="">New American Dollar: Codename 'Pigcoin' Democratic Cryptocurrency</a>
						</div>
						<div class='price'>
							Price: $1 for 1 NAD
						</div>
						<div class='desc'>
							An experimental cryptocurrency currently under development by the owners of Hunimal.org.
						</div>
					</div>
					<div class='coming-soon'>
						Coming soon!
					</div>
				</div>
			</div>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
