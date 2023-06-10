<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>New American Dollar: Transactions</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Pigcoin-specific -->
	<link rel="stylesheet" href="style/pigcoin.css">
	<script src="script/transactions.js"></script>
</head>
<body>
    <h1>New American Dollar: Transactions</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>Transactions</h2>
			<? include('pigcoin-links.php'); ?>
			<ul>
				<li><a href='#reg-h3'>Regular transactions</a></li>
				<li><a href='#gen-h3'>Genesis transactions</a></li>
			</ul>
			<?
				$sWalletId = $_GET['wallet'];
				$sFromDate = $_GET['fromDate'];
				$sToDate = $_GET['toDate'];
				$sAmountLow = $_GET['amountLow'];
				$sAmountHigh = $_GET['amountHigh'];
					
				$sFromTs = strtotime($sFromDate . " 00:00:01");
				$sToTs = strtotime($sToDate . " 23:59:59");

				function quote($a) {
					return "'$a'";
				}
			?>
			<h3>Search regular and genesis transactions</h3>
			<form method="get" action='Transactions.php'>
				<label for="fromDate">From Date:</label>
				<input type="date" name="fromDate" value=<? echo quote($sFromDate);?>><br>
				<label for="toDate">To Date:</label>
				<input type="date" name="toDate" value=<? echo quote($sToDate);?>><br>
				<label for="amountLow">Amount:</label>
				<input type="text" name="amountLow" value=<? echo quote($sAmountLow);?>> - 
				<input type="text" name="amountHigh" value=<? echo quote($sAmountHigh);?>><br>
				<input type="submit" value="Submit">
				<a class="js" id="clear-form-reg-a">Clear</a>
			</form>
			<h3 id='reg-h3'>Regular transactions</h3>
			<p><a class="js" id="hide-reg-txn-a">Hide regular transactions</a></p>
			<?
				require_once('pigcoin-connect.php');

				$sql = "SELECT sendId,recId,amount,fee,ts FROM txnReg;";
				$stmt = $conn->prepare($sql);
				$stmt->execute();
				$res = $stmt->get_result();

				if (!$res) {
					echo('<p>Database error</p>');
				} else {
					?>
					<table id="reg-table">
					<tr>
						<td></th>
						<th>Send Wallet</th>
						<th>Receive Wallet</th>
						<th>Amount
							<a class="js" id="sort-desc-reg-amount-a">&#x2191;</a>
							<a class="js" id="sort-asc-reg-amount-a">&#x2193;</a>
						</th>
						<th>Fee</th>
						<th>Timestamp
							<a class="js" id="sort-desc-reg-ts-a">&#x2191;</a>
							<a class="js" id="sort-asc-reg-ts-a">&#x2193;</a>
						</th>
					</tr>
					<?
					$i = 0;
					while ($row = $res->fetch_row()) {
						$sendId = $row[0];
						$recId = $row[1];
						$amount = $row[2]/10000;
						$fee = $row[3]/10000;
						$ts = $row[4];
						if ($sWalletId and $sendId != $sWalletId and 
								$recId != $sWalletId) {
							continue;
						}
						if ($sFromDate and $sFromTs > strtotime($ts)) {
							continue;
						}
						if ($sToDate and $sToTs < strtotime($ts)) {
							continue;
						}
						if ($sAmountLow and intval($sAmountLow) > $amount) {
							continue;
						}
						if ($sAmountHigh and intval($sAmountHigh) < $amount) {
							continue;
						}
						$amount = sprintf("%.2f PIG", $amount);
						$fee = sprintf("%.2f PIG", $fee);
						$linkSend = 
							"<a href='Wallets.php?wallet=$sendId'>$sendId</a>";
						$linkRec = 
							"<a href='Wallets.php?wallet=$recId'>$recId</a>";
						?><tr>
							<td><? echo $i++; ?></td>
							<td><? echo $linkSend; ?></td>
							<td><? echo $linkRec; ?></td>
							<td class='amount-column'><? echo $amount; ?></td>
							<td><? echo $fee; ?></td>
							<td class='ts-column'><? echo $ts; ?></td>
						</tr>
						<?
					}
					?>
					</table>
					<?
				}
			?>
			<h3 id='gen-h3'>Genesis transactions</h3>
			<p><a class='js' id='hide-gen-txn-a'>Hide genesis transactions</a></p>
			<?
				$sql = "SELECT adamId,eveId,amount,ts FROM txnGen;";
				$stmt = $conn->prepare($sql);
				$stmt->execute();
				$res = $stmt->get_result();

				if (!$res) {
					echo('<p>Database error</p>');
				} else {
					?>
					<table id='gen-table'>
						<tr>
							<th></th>
							<th>Adam Wallet</th>
							<th>Eve Wallet</th>
							<th>Amount
								<a class="js" id="sort-desc-gen-amount-a">&#x2191;</a>
								<a class="js" id="sort-asc-gen-amount-a">&#x2193;</a>
							</th>
							<th>Timestamp
								<a class="js" id="sort-desc-gen-ts-a">&#x2191;</a>
								<a class="js" id="sort-asc-gen-ts-a">&#x2193;</a>
							</th>
						</tr>
					<?
					$i = 0;
					while ($row = $res->fetch_row()) {
						$adamId = $row[0];
						$eveId = $row[1];
						$amount = $row[2]/10000;
						$ts = $row[3];
						if ($sWalletId and $adamId != $sWalletId and 
								$eveId != $sWalletId) {
							continue;
						}
						if ($sFromDate and $sFromTs > strtotime($ts)) {
							continue;
						}
						if ($sToDate and $sToTs < strtotime($ts)) {
							continue;
						}
						if ($sAmountLow and intval($sAmountLow) > $amount) {
							continue;
						}
						if ($sAmountHigh and intval($sAmountHigh) < $amount) {
							continue;
						}
						$amount = sprintf("%.2f PIG", $amount);
						$linkAdam = 
							"<a href='Wallets.php?wallet=$adamId'>$adamId</a>";
						$linkEve = 
							"<a href='Wallets.php?wallet=$eveId'>$eveId</a>";
						?><tr>
							<td><? echo $i++; ?></td>
							<td><? echo $linkAdam; ?></td>
							<td><? echo $linkEve; ?></td>
							<td class='amount-column'><? echo $amount; ?></td>
							<td class='ts-column'><? echo $ts; ?></td>
						</tr>
						<?
					}
					?>
					</table>
					<?
				}
			?>
			<? include('pigcoin-links.php'); ?>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
