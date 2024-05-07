<? set_include_path('/home3/calmprepared/public_html/'); ?>
<? $title = 'Brochure Contest'; ?>
<!DOCTYPE html>
<html>
<head>
    <title><? echo $title; ?></title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<!--<link rel="stylesheet" href="style/index.css">
	<script src="script/index.js"></script>-->
	<script src="https://www.gstatic.com/charts/loader.js"></script>
<script>
<?
	// Get votes from database
	$data = array();

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

	// Add to data array
	while ($row = $res->fetch_assoc()) {
		array_push($data, $row);
	}

	// Sort by number of votes
	function compare($a, $b) {
		return $b['votes'] - $a['votes'];
	}

	usort($data, 'compare');

	// Prepare for javascript
	function transform($a) {
		return '["' . $a['name'] . '",' . $a['votes'] . ']';
	}

	$data = array_map('transform', $data);
	array_unshift($data, '["Name", "Votes"]');

	echo 'const data = [' . implode(',', $data) . '];';
?>
	google.charts.load('current', {packages: ['corechart', 'bar']});	
	google.charts.setOnLoadCallback(drawTop5);

<?
after:;
?>

function drawTop5() {
	const table = new google.visualization.arrayToDataTable(data.slice(0,5));
	const options = {
		backgroundColor: { fillOpacity: 0},
		chartArea: {backgroundColor: {fillOpacity: 0}},
		legend: {position: 'none'},
		bars: 'horizontal',
		axes: {
			x : {0: {side: 'top', label: 'Number of votes'}}
		},
		bar: {groupWidth: '90%'}
	};

	const chart = new google.charts.Bar(document.querySelector('#chart'));
	chart.draw(table, google.charts.Bar.convertOptions(options));
}
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
</style>
</head>
<body>
    <h1><? echo $title; ?></h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<h2>Hunimal brochures!</h2>
			<p><b style='color: red;'>The contest is over! Congratulations to bish bosh, officebaconfarts, and studsstudio (made up of the top 3 entries trying to cheat the contest). You will be receiving communications about your $20, $10, and $5 winnings shortly from David.</b></p>
			<p>I am running a contest for a brochure advertising the Hunimal number system. I've been asked to put up a display about Hunimal in my local library; the thought is that patrons can take a brochure home with them.</p>
			<p>The requirements are that
			<ul>
				<li>the brochure is informative, and</li>
				<li>it mentions <a href='/'>Hunimal.org</a> in some way.</li>
			</ul>
			Anyone can enter anything but to win prizes you must satisfy these criteria.</p>
            <p><b style='color: red;'>The end date of the contest will be midnight Saturday May 4. Winners will be contacted for payouts (probably PayPal) then. Thanks to everyone for participating!</b></style>
			<p>Prizes:
			<ul>
				<li>First place: <strike>$500</strike> $20</li>
				<li>Second place: <strike>$250</strike> $10</li>
				<li>Third place: <strike>$100</strike> $5</li>
			</ul>
			</p>
			<p>Winners will be determined by community vote.</p>
			<p><a href='Submit.php'>Submit a brochure</a> <a href='Gallery.php'>Vote on submissions</a></p>
			<h3>Top Submissions</h3>
<?
	if (isset($error)) {
		echo "<p>$error</p>";		
	} else {
?>
			<div id='chart' style='width: 30%; height: 200px; min-width: 300px;'></div>
			<h3>Latest Brochures</h3>
			<div id='latest'>
<?
		// Get files in brochures directory
		$files = scandir('brochures');

		function getFname($id, $files) {
			foreach ($files as $file) {
				if ($id == explode('.', $file)[0]) {
					return $file;
				}
			}
		}

		$res->data_seek(0);
		$data = array();
		while ($row = $res->fetch_assoc()) {
			array_push($data, $row);
		}
		$data = array_reverse($data);
		for ($i = 0; $i < 2 && $i < count($data); $i++) {
			$id = $data[$i]['id'];
			$fname = getFname($id, $files);
			$name = $data[$i]['name'];
			$votes = $data[$i]['votes'];
			echo "<div class='brochure' data-id='$id'>
				<div>
					<span class='brochure-name'>$name</span>
					<span class='brochure-votes'>$votes</span> votes
				</div>
				<img src='brochures/$fname' alt='$fname'>
				</div>";
		}
	}
?>
			</div>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
