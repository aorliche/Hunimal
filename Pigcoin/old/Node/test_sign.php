<?
	require_once('Error.php');
	require_once('NodeInfo.php');

	$dat = array('a'=>'a','sig'=>'');
	signPacket($dat, $ThisNodeInfo);
	echo $dat['sig'];
?>
