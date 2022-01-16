<?
    $servername = "localhost";
    $username = "calmprep_blog";
    $password = "Blogzilla";
    $dbname = "calmprep_blog";
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

	$sql = "SELECT post_title, post_date, guid, wp_users.user_login 
		FROM wp_posts 
		LEFT JOIN wp_users ON wp_posts.post_author = wp_users.ID
		WHERE post_status = 'publish' AND post_parent = 0
		ORDER BY post_date DESC
		LIMIT 1;";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $title = $row["post_title"];
            $date = $row["post_date"];
			$guid = $row["guid"];
			$user_name = $row["user_login"];
			$dt = date_create($date);
			?>

			<p>
				<strong style="color: red;">
					Latest Post:
				</strong>
				<a href="<? echo $guid ?>">
					<? echo $title ?>
				</a>
			by <? echo $user_name ?> on <? echo $dt->format("F jS, Y")?></p>
			
			<?
        }
    } else {
        echo "no results";
    }

    $conn->close();
?>
