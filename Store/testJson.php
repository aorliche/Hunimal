<?
	$text = array( 'a' => 1, 'b' => 2, 3 => 'c', 4 => array('a' => 'z'));
	$json = json_decode(json_encode($text));
	echo $json->a;
	echo "\n";
	echo $json->{'3'};
	echo "\n";
	echo $json->{'4'}->a;
	echo "\n";
?>
