<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Poker</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<link rel="stylesheet" href="style/index.css">
	<script src="script/index.js"></script>
</head>
<body>
    <h1>Hunimal Poker (Hunniker)</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>Hunniker</h2>
            <p>Welcome to the Hunimal Poker game, based off of Texas Hold-Em! Hand ranks are, in order from best to worst, <u>Five Cards of a Color</u>, <u>Three and a Pair</u>, <u>Four Cards of a Color</u>, <u>Three Cards of a Color</u>, <u>Two Pair</u>, and <u>High Card</u>.</p>
            <p>Ties are broken first by rarity of a color and second by high card in the relevant color (colors for "Three and Two" and "Two Pair").</p>
            <p>Colors represent how many factors a given humber has. Black represents primes, blue represents two factors, teal represents three factors, and green (rarest) represents four or more factors. The rarity is Green &gt; Teal &gt; Black &gt; Blue.</p>
            <iframe src='/hunniker/' width='1250' height='800'></iframe>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
