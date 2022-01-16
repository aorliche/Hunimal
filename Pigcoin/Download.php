<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Download VirtualWallet</title>
    <? include('generic.php'); ?>
</head>
<body>
    <h1>Download VirtualWallet</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
            <h2>Virtual Wallet v0.1</h2>
			<p><img src='image/pig64.ico' width='32' alt='Pigcoin Icon'> <span style='position: relative; top: -8px;'><a href='files/VirtualWallet0.1Installer.exe'>Download VirtualWallet v0.1</a> - 61.058 MB</span></p>
			<img src='image/VirtualWallet0_1.png' alt='Virtual Wallet v0.1'>
			<p>This is the alpha version of the NAD virtual wallet. It uses the Windows Presentation Foundation (WPF) .NET toolkit which I found to be the easiest way to create a functional Windows GUI.</p>
			<p><a href='/Contact.php'>To use the wallet you currently have to contact myself or David to allocate currency to you</a>.</p>
			<p><strong style='color: red;'>We hope to soon have a beta test where you can automatically acquire currency.</strong></p>
			<img src='image/Developer.png' alt='Developer Console'>
			<p>Check out the <a href='Developer.php'>Developer</a> page to see what is under the hood and get hacking.</p>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
