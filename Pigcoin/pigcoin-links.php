<? require_once('pigcoin-connect.php'); ?>
<? require_once('pigcoin-wealth.php'); ?>
<ul class='pigcoin-links'>
	<li class='wealth-li'>Total NAD Wealth: <span class='wealth-span'><?
   		if (!$pigcoinWealth) {
			echo('Database error');
		} else {
			printf("%.2f", $pigcoinWealth);
		}
	?></span> PIG</li>
	<li><a href='Nodes.php'>Nodes</a></li>
	<li><a href='Wallets.php'>Wallets</a></li>
	<li><a href='Transactions.php'>Transactions</a></li>
</ul>
