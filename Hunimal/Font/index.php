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
	<h1>Hunimal Font</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h3>A currently anonymous Fontier has created the first version of the Hunimal font for us!</h3>
			<p>Click the link to download the font: <a href="font/HunimalSansv1.5.ttf">HunimalSansv1.5.ttf</a></p>
			<p>You'll regret it <span class='hunimal-font'>&#x5500;</span> times out of <span class='hunimal-font'>&#x5501;&#x5500;</span>!</p>
			<h3>According to the Fontier:</h3> 
			<ul>
				<li>The unicode value of each number is U+55__ so Zo is "U+5500", Nin is "U+5599" Free is "U+5543" and so on.</li> 
				<li>To display the font on web pages, you can write, for instance, <tt>&amp;#x5500;</tt> to display a Zo (<span class='hunimal-font'>&#x5500;</span>), <tt>&amp;#x5510;</tt> to display a Zote (<span class='hunimal-font'>&#x5510;</span>), and so on.</li>
				<li>To load the font onto your webpage requires some work with CSS.</li>
				<li>See the following link: <a href="https://www.w3schools.com/cssref/css3_pr_font-face_rule.asp">https://www.w3schools.com/cssref/css3_pr_font-face_rule.asp</a></li>
			</ul>
			<h3>Note: There are currently <del>two</del> one main issue<del>s</del> with the font:</h3>
			<ol>
				<li>There is currently no good uniform way to enter the font via the keyboard similarly to regular typing of non-English languages. According to the Fontier using the numpad for input is clunky and non-portable. He suggests the following two resources:</li>
				<ul>
					<li>An article on some methods for windows: <a href="https://wwww.fileformat.info/tip/microsoft/enter_unicode.htm">https://wwww.fileformat.info/tip/microsoft/enter_unicode.htm</a></li>
					<li>A standalone program called <a href="https://fileformat.info/tool/unicodeinput/index.htm">UnicodeInput</a></li>
				</ul>
				<li><del>On at least one web browser (Opera), the Hunimal numbers display as Chinese glyphs since their unicode values are the same as some Chinese characters.</del> For me it seems that this problem has been fixed either after restarting Opera or restarting the computer.</li>
			</ol>
			<p>Check out the table below for the hunimal numbers 00-99.</p>
			<table id="hunimal-list-table-font"></table>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
