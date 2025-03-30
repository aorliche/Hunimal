<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Square numbers -->
    <script type='module' src='square-numbers.js'></script>
    <title>Square Numbers</title>
</head>
<body>
    <h1>Hunimal</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main" class='hunimal-font'>
            <label for='base'>Base:</label>
            <input type='text' name='base' id='base' value='10'>
            <button id='generate'>Generate</button>
            <table id='results'>
            </table>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
