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
			<a id='showver2' href='#ver2'>V2</a>
			<a id='showver3' href='#ver3'>V3</a>
			<a id='showcentimal' href='#centimal'>Centimal</a>
			<a id='showfrench' href='#french'>French</a>
            <a id='showspanish' href='#spanish'>Spanish</a>
            <a id='showrussian' href='#russian'>Russian</a>
            <a id='showgerman' href='#german'>German</a>
            <a id='showkorean' href='#korean'>Korean</a>
			<a id='showswedish' href='#swedish'>Swedish</a>
			<a id='showportuguese' href='#portuguese'>Portuguese (AI)</a>
			<a id='showmandarin' href='#mandarin'>Mandarin 汉语百进制 (AI)</a>
			<a id='showcantonese' href='#cantonese'>Cantonese Jyutping (AI)</a>
			<a id='showhindi' href='#hindi'>Hindi (AI)</a>
            </p>
			<p>Check out the table below for the hunimal numbers 00-99.</p>
            <h3 id='english' style='display: none;'>English (Hunimal) Version 1</h3>
			<table id="hunimal-list-table" class='huntab' style='display: none;'></table>
            <h3 id='ver2'>English (Hunimal) Version 2</h3>
			<table id="hunimal-ver2" class='huntab'></table>
            <h3 id='ver3' style='display: none;'>English (Hunimal) Version 3</h3>
			<table id="hunimal-ver3" class='huntab' style='display: none;'></table>
            <h3 id='centimal' style='display: none;'>English (Competing Centimal System)</h3>
			<table id="hunimal-centimal" class='huntab' style='display: none;'></table>
            <h3 id='french' style='display: none;'>French (Centimal)</h3>
            <table id="hunimal-french" class='huntab' style='display: none;'></table>
            <h3 id='spanish' style='display: none;'>Spanish (Cienimal)</h3>
            <table id="hunimal-spanish" class='huntab' style='display: none;'></table>
            <h3 id='russian' style='display: none;'>Russian (Sotimal)</h3>
            <table id="hunimal-russian" class='huntab' style='display: none;'></table>
            <h3 id='german' style='display: none;'>German (Dertimal)</h3>
            <table id="hunimal-german" class='huntab' style='display: none;'></table>
            <h3 id='korean' style='display: none;'>Korean (Baekimal)</h3>
            <table id="hunimal-korean" class='huntab' style='display: none;'></table>
            <h3 id='swedish' style='display: none;'>Swedish (Hunärt)</h3>
			<table id='hunimal-swedish' class='huntab' style='display: none;'></table>
            <h3 id='portuguese' style='display: none;'>Portuguese (PORTUÑOL)</h3>
			<table id='hunimal-portuguese' class='huntab' style='display: none;'></table>
            <h3 id='mandarin' style='display: none;'>MANDARIN HUNIMAL CHART (汉语百进制)</h3>
			<table id='hunimal-mandarin' class='huntab' style='display: none;'></table>
            <h3 id='cantonese' style='display: none;'>Cantonese</h3>
			<table id='hunimal-cantonese' class='huntab' style='display: none;'></table>
            <h3 id='hindi' style='display: none;'>Hindi</h3>
			<table id='hunimal-hindi' class='huntab' style='display: none;'></table>
			<p id='centimal-exp' style='display: none;'>The Centimal system, originally found at <a href='https://centimal.org'>https://centimal.org</a>, is a competing though inferior system to Hunimal. As of December 2025 the site can be reached via the Internet Archive Wayback Machine. Their most significant feature was the Centimal geolocation service.</p>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
