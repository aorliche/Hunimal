<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal.org</title>
    <? include('generic.php'); ?>
</head>
<body>
    <h1>Hunimal.org</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
            <h2>Geometry, signal processing, and number systems.</h2>
            <p>Welcome to my website! Here I give examples of and talk about concepts in geometry,
            mathematics, signal processing, and the Hunimal number 
            system that I invented.</p>
            <p>Click the links on the left to check out each of these topics!</p>
			<big><? include 'latest-post.php'; ?></big>
			<p><strong>September 6, 2021:</strong></p>
			<p><a style="font-size: 20px;" href="/Email/">You can now get @hunimal.org email accounts!</a></p>
			<p><strong>March 16, 2021:</strong></p>
			<p><a style="font-size: 20px;" href="/Hunimal/Font/">We now have a Font</a>! <span class="hunimal-font">&#x5500; &#x5515; &#x5590;</span></p>
			<p><strong>January 24, 2021:</strong></p>
			<p><a href="/Blog/" style="font-size: 20px">The Blog section is now up and running! </a></p>
            <p><strong>December 20, 2020:</strong></p>
            <p><a href="https://www.tinyurl.com/learnhunimal" style="font-size: 20px;">Learn Hunimal</a> - 
            I've created a Google Doc that has all the Hunimal numbers 00-99 for easy learning and reference.
            </p>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
