<?php set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Visual Quiz</title>
    <? include('generic.php'); ?>
</head>
<body>
    <h1>Visual Quiz: Take Quiz</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
<?php
if (isset($_GET['page'])) {
    $page = $_GET['page'];
} else {
    $page = false;
}
if ($page) {
?>
        
            <iframe width='1550' height='1200' src='/visual-quiz/quiz.html?page=<?= urlencode($page) ?>'></iframe>
<?php
} else {
?>
            <iframe width='1550' height='1200' src='/visual-quiz/quiz.html'></iframe>
<?php
}
?>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
