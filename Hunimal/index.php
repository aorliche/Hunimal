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
            <a id='showenglish' href='#english'>English</a>
            <a id='showspanish' href='#spanish'>Spanish</a>
            <a id='showrussian' href='#russian'>Russian</a>
            <a id='showgerman' href='#german'>German</a>
            <a id='showkorean' href='#korean'>Korean</a>
            <a id='showswedish' href='#swedish'>Swedish</a>
            </p>
			<p>Check out the table below for the hunimal numbers 00-99.</p>
            <h3 id='english'>English (Hunimal)</h3>
			<table id="hunimal-list-table"></table>
            <h3 id='spanish' style='display: none;'>Spanish (Cienimal)</h3>
            <table id="hunimal-spanish" class='huntab' style='display: none;'></table>
            <h3 id='russian' style='display: none;'>Russian (Sotimal)</h3>
            <table id="hunimal-russian" class='huntab' style='display: none;'></table>
            <h3 id='german' style='display: none;'>German (Dertimal)</h3>
            <table id="hunimal-german" class='huntab' style='display: none;'></table>
            <h3 id='korean' style='display: none;'>Korean (Baekimal)</h3>
            <table id="hunimal-korean" class='huntab' style='display: none;'></table>
            <h3 id='swedish' style='display: none;'>Swedish (Hunårt)</h3>
            <table id='hunimal-swedish' class='huntab' style='display: none;'></table>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
