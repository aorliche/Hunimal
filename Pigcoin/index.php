<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>New American Dollar</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Pigcoin-specific -->
	<link rel="stylesheet" href="style/pigcoin.css">
	<!--<script src="script/index.js"></script>-->
</head>
<body>
    <h1>New American Dollar</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>New American Dollar</h2>
			<? include('pigcoin-links.php'); ?>
			<p>The New American Dollar (NAD) is a cryptocurrency under development by the owners of <a href="/">Hunimal.org</a>. It's premise is a convenient, secure, and democratic decentralized currency system that fixes many of the problems found in contemporary crypto.</p>
			<p>The features of the NAD that make it stand out are:</p>
			<ul id="features">
				<li><b>Instantaneous Money Transfer</b> - Transactions with NADs are as fast as with a major credit card</li>
				<li><b>Proof of Stake</b> - No miners using huge amounts of computing hardware and electricity in the hope of winning a periodic lottery</li>
				<li><b>System of Nodes</b> - Full nodes maintain the current state of the cryptocurrency leger and consensus is reached by +50% of node wealth</li>
				<li><b>Snapshots Instead of Blockchain</b> - Instead of blocks there are numbered snapshots that serve as save points for wallet balances</li>
				<li><b>Accountability</b> - In order to maintain the state of the leger and collect transaction fees, full nodes must keep some NADs in an escrow account</li>
				<li><b>Democracy</b> - All NAD holders can vote in proportion to their wealth to inflate the currency, change protocol parameters, or punish misbehaving nodes</li>
				<li><b>Crypto on Paper</b> - It is possible to create and plunder piles; piles are one-time-use wallets that can be printed, carried, and exchanged almost like paper bills</li>
				<li><b>Backed by "Real Money"</b> - Users can purchase NADs for fiat currency (USD etc.) and have confidence they can exchange back at any time without losing anything</li>
			</ul>
			<p>This page is a jumping-off point for summary information about the NAD ecosystem.</p>
			<? include('pigcoin-links.php'); ?>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
