<? set_include_path('/home3/calmprepared/public_html/'); ?>
<? $title = 'Brochure Gallery'; ?>
<?
	// Connect to mysql
	$servername = "localhost";
	$username = "calmprep_anton";
	$password = "MySQL1@bbb";
	$dbname = "calmprep_hunimal";

	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		$error = $conn->connect_error;
		goto after;
	}

	// Get all submissions info
	$sql = 'select a.id id, a.name name, count(b.id) votes 
		from brochure_contest a
			left join brochure_contest_votes b
				on a.id = b.brochure_id
		group by a.id, a.name;';
	$stmt = $conn->prepare($sql);
	if ($conn->error) {
		$error = $conn->error;
		goto after;
	}
	$stmt->execute();
	$res = $stmt->get_result();
	if (!$res) {
		$error = $conn->error;
		goto after;
	}

	// Get files in brochures directory
	$files = scandir('brochures');

	function getFname($id, $files) {
		foreach ($files as $file) {
			if ($id == explode('.', $file)[0]) {
				return $file;
			}
		}
	}

after:
?>
<!DOCTYPE html>
<html>
<head>
    <title><? echo $title; ?></title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<!--<link rel="stylesheet" href="style/index.css">
	<script src="script/index.js"></script>-->
	<script src='https://www.google.com/recaptcha/api.js?render=6Lfas6IeAAAAAF2xcFZqf2cPBU2lQBB5GQAoTS2o'></script>
<script>
function vote(a) {
	const id = a.dataset.id;
	grecaptcha.ready(function() {
		grecaptcha.execute('6Lfas6IeAAAAAF2xcFZqf2cPBU2lQBB5GQAoTS2o')
			.then(token => {
				fetch(`Vote.php?id=${id}&token=${token}`)
					.then(response => response.json())
					.then(data => {
						if (data.success) {
							location.reload();
						} else {
							const error = document.querySelector('#error');
							error.innerText = data.error;
							error.style.display = 'block';
							console.log(data.error);
						}
					});
			});
	});
}
window.onload = e => {
	document.body.addEventListener('click', e => {
		const error = document.querySelector('#error');
		error.style.display = 'none';	
	});
};
</script>
<style>
.brochure {
	width: 400px;
	display: inline-block;
	margin-bottom: 10px;
	vertical-align: top;
}
.brochure img {
	max-width: 380px;
	max-height: 500px;
}
#error {
	background-color: #ff4444;
	color: white;
	width: 100%;
	position: fixed;
	top: 0px;
	text-align: center;
	vertical-align: center;
	font-size: 24px;
	padding: 10px;
	display: none;
	z-index: 10;
}
</style>
</head>
<body>
	<div id='error'></div>
    <h1><? echo $title; ?></h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
<?
	if (isset($error)) {
		echo "<h2>Error<h2><p>An error occurred: $error</p>";
	} else {
		echo "<h2>Current Submissions</h2>";
		echo "<p>" . $res->num_rows . " submissions</p>";
		echo "<p><a href='Contest.php'>Back to contest</a></p>";
		echo "<div id='brochures'>";
		$data = array();
		while ($row = $res->fetch_assoc()) {
			array_push($data, $row);
		}

		// Sort by number of votes
		function compare($a, $b) {
			return $b['votes'] - $a['votes'];
		}

		usort($data, 'compare');

		foreach ($data as $row) {
			$id = $row['id'];
			$fname = getFname($id, $files);
			$name = $row['name'];
			$votes = $row['votes'];
			echo "<div class='brochure' data-id='$id'>
				<div>
					<span class='brochure-name'>$name</span>
					<span class='brochure-votes'>$votes</span> votes
					<a href='#' data-id='$id' onclick='vote(this); return false;'>Vote Up</a>
				</div>
				<img src='brochures/$fname' alt='$fname'>
				</div>";
		}
		echo "</div>";
	}
?>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
