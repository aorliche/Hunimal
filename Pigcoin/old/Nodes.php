<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>New American Dollar: Nodes</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Pigcoin-specific -->
	<link rel="stylesheet" href="style/pigcoin.css">
	<!--<script src="script/index.js"></script>-->
</head>
<body>
    <h1>New American Dollar: Nodes</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>Active Nodes</h2>
			<? include('pigcoin-links.php'); ?>
			<p>Browse currently active, joining, and leaving full nodes.</p>
			<?
				require_once('pigcoin-connect.php');

				$sql = "SELECT name,email,uri,balance from nodes left join wallets on walletId = wallets.id;";
				$stmt = $conn->prepare($sql);
				$stmt->execute();
				$res = $stmt->get_result();

				if (!$res) {
					echo('<p>Database error</p>');
				} else {
					?>
					<table id="nodes-table">
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>URI</th>
						<th>Balance</th>
					</tr>
					<?
					while ($row = $res->fetch_row()) {
						$name = $row[0];
						$email = $row[1];
						$uri = $row[2];
						$balance = sprintf("%.2f PIG", $row[3]/10000);
						?><tr>
							<td><? echo $name; ?></td>
							<td><? echo $email; ?></td>
							<td><? echo $uri; ?></td>
							<td><? echo $balance; ?></td>
						</tr>
						<?
					}
					?></table><?
				}

			?>
			<? include('pigcoin-links.php'); ?>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
