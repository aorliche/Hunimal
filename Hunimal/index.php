<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<link rel="stylesheet" href="style/index.css">
	<script src="script/index.js"></script>
</head>
<body>
    <h1>Hunimal</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>Hunimal Numbers!</h2>
            <p>
            <a href='#spanish'>Spanish</a>
            <a href='#russian'>Russian</a>
            <a href='#german'>German</a>
            <a href='#korean'>Korean</a>
            </p>
			<p>Check out the table below for the hunimal numbers 00-99.</p>
			<table id="hunimal-list-table"></table>
            <h3 id='spanish'>Spanish (Cienimal)</h3>
            <table id="hunimal-spanish" class='huntab'></table>
            <h3 id='russian'>Russian (Sotimal)</h3>
            <table id="hunimal-russian" class='huntab'></table>
            <h3 id='german'>German (Dertimal)</h3>
            <table id="hunimal-german" class='huntab'></table>
            <h3 id='korean'>Korean (Baekimal)</h3>
            <table id="hunimal-korean" class='huntab'></table>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
