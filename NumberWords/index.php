<?php set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Numbers to Words</title>
    <? include('generic.php'); ?>
</head>
<body>
    <h1>Numbers to Words</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
            <p>Fill in the words based on number-letter associations and the type of number.</p>
            <iframe width='1200' height='400' src='/number-words/'></iframe>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
