<?
	$_COOKIE["a"] = "a\n";
	echo $_COOKIE["a"];

backward:
	if (isset($_COOKIE["a"])) {
		echo "got here\n";
		unset($_COOKIE["a"]);
		goto backward;
	}

	echo "all done\n";
?>
