<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>New American Dollar: Wallets</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Pigcoin-specific -->
	<link rel="stylesheet" href="style/pigcoin.css">
	<script src="script/wallets.js"></script>
</head>
<body>
    <h1>New American Dollar: Wallets</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>Wallets</h2>
			<? include('pigcoin-links.php'); ?>
			<h3>Search wallets</h3>
			<?
				$sWalletId = $_GET['wallet'];
				$sName = $_GET['name'];
				$sNoName = $_GET['noName'];
				$sEmail = $_GET['email'];
				$sNoEmail = $_GET['noEmail'];
				$sPubKey = $_GET['pubKey'];
				$sBalLow = $_GET['balLow'];
				$sBalHigh = $_GET['balHigh'];

				$noNameChecked = ($sNoName == "on") ? "checked" : '';
				$noEmailChecked = ($sNoEmail == "on") ? "checked" : '';

				function quote($a) {
					return "'$a'";
				}
			?>
			<form method="get">
				<label for="name">Name:</label>
				<input type="text" name="name" value=<? echo quote($sName);?>>
				<input type="checkbox" <? echo $noNameChecked; ?> name="noName">None<br>
				<label for="email">Email:</label>
				<input type="text" name="email" value=<? echo quote($sEmail);?>>
				<input type="checkbox" <? echo $noEmailChecked; ?> name="noEmail">None<br>
				<label for="pubKey">Public Key:</label>
				<input type="text" name="pubKey" value=<? echo quote($sPubKey);?>><br>
				<label for="balLow">Balance:</label>
				<input type="text" name="balLow" value=<? echo quote($sBalLow);?>> - 
				<input type="text" name="balHigh" value=<? echo quote($sBalHigh);?>><br>
				<input type="submit" value="Submit">
				<a class="js" id="clear-form-a">Clear</a>
			</form>
			<?
				require_once('pigcoin-connect.php');

				$sql = "SELECT id,name,email,pubKey,balance FROM wallets;";
				$stmt = $conn->prepare($sql);
				$stmt->execute();
				$res = $stmt->get_result();

				if (!$res) {
					echo('<p>Database error</p>');
				} else {
					?>
					<table id="wallets-table">
					<tr>
						<td></th>
						<th>Name</th>
						<th>Email</th>
						<th>Public Key</th>
						<th>Balance 
							<a class="js" id="sort-desc-a">&#x2191;</a>
							<a class="js" id="sort-asc-a">&#x2193;</a>
						</th>
						<th>Transactions</th>
					</tr>
					<?
					$i = 0;
					while ($row = $res->fetch_row()) {
						$id = $row[0];
						$name = $row[1];
						$email = $row[2];
						$pubKey = $row[3];
						$balance = $row[4]/10000;
						if ($sWalletId and $id != $sWalletId) {
							continue;
						}
						if ($sNoName and $name != "") {
							continue;
						}
						if ($sName and !strstr(strtolower($name), 
								strtolower($sName))) {
							continue;
						}
						if ($sNoEmail and $email != "") {
							continue;
						}
						if ($sEmail and !strstr(strtolower($email), 
								strtolower($sEmail))) {
							continue;
						}
						if ($sPubKey and !strstr($pubKey, $sPubKey)) {
							continue;
						}
						if ($sBalLow and intval($sBalLow) > $balance) {
							continue;
						}
						if ($sBalHigh and intval($sBalHigh) < $balance) {
							continue;
						}
						$balance = sprintf("%.2f PIG", $balance);
						$link = "<a href='Transactions.php?wallet=$id'>View Transactions</a>";
						$pubKeyLink = " <a class='js'>View Full</a>";
						$pubKeyAll = "<span>$pubKey</span>" . $pubKeyLink;
						?><tr>
							<td><? echo $i++; ?></td>
							<td><? echo $name; ?></td>
							<td><? echo $email; ?></td>
							<td class='pub-key-column'><? echo $pubKeyAll; ?></td>
							<td class='balance-column'><? echo $balance; ?></td>
							<td><? echo $link; ?></td>
						</tr>
						<?
					}
					?></table>
					<p><small>*Public key is shown without the leading 44 characters.</small></p>
					<?
				}

			?>
			<? include('pigcoin-links.php'); ?>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
