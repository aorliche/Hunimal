<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Humbart Gallery</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<link rel="stylesheet" href="style/humbart.css">
	<script src="script/humbart.js"></script>
</head>
<?php
    $nperpage = 10;
    $page = $_GET['page'];
    if (!$page) {
        $page = 1;
    } else {
        $page = intval($page);
    }
    $files = scandir('./image/humbart');
    $files = array_diff($files, array('.','..'));
    sort($files);
?>
<body>
    <h1>Humbart Gallery</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
<?php
    // Draw navigation
    $prev = $page - 1;
    $next = $page + 1;
    echo "<div class='nav-container'>\n";
    if ($prev > 0) {
        echo "<a href='Humbart.php?page=$prev'>Previous</a>\n";
    } else {
        echo "<a href='#'>Previous</a>\n";
    }
    if ($next < count($files)/10) {
        echo "<a href='Humbart.php?page=$next'>Next</a>\n";
    }
    echo "</div>\n";
    echo "<div class='gallery'>\n";
    for ($i = ($page-1)*10; $i < $page*10; $i++) {
        echo "<div class='humbart-entry'>\n";
        echo "<img src='./image/humbart/${files[$i]}' class='humbart-img'>\n";
        echo "<p>${files[$i]}</p>\n";
        echo "</div>\n";
    }
    echo "</div>\n";
?>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
