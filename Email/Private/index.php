<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<link rel="icon" type="image/png" href="/image/H.png">
    <title>Hunimal Email Private Curation</title>
	<script>
window.addEventListener("load", e => {
	const buttons = document.querySelectorAll("button");
	const form = document.querySelector("#my-form");
	for (let i=0; i<buttons.length; i++) {
		if (buttons[i].hasAttribute('data-email-id')) {
			buttons[i].addEventListener("click", e => {
				if (buttons[i].innerText == "Accept") {
					form.elements["action"].value = 'Accept';
				} else {
					form.elements["action"].value = 'Reject';
				}
				form.elements["email_id"].value = buttons[i].getAttribute("data-email-id");
				form.submit();
			}, false);
		} else if (buttons[i].hasAttribute('data-email-reset-id')) {
			buttons[i].addEventListener("click", e => {
				if (buttons[i].innerText == "Accept") {
					form.elements["action"].value = 'Accept';
				} else {
					form.elements["action"].value = 'Reject';
				}
				form.elements["email_reset_id"].value = buttons[i].getAttribute('data-email-reset-id');
				form.submit();
			}, false);
		}
	}
}, false);
	</script>
</head>
<body>
    <h1>Hunimal Email Private Curation</h1>
	<form id="my-form" action="." method="post">
		<input type="hidden" name="action" value="">
		<input type="hidden" name="email_id" value="">
		<input type="hidden" name="email_reset_id" value="">
	</form>
<?
	// Connect to mysql
	$servername = "localhost";
	$username = "calmprep_anton";
	$password = "MySQL1@bbb";
	$dbname = "calmprep_hunimal";

	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		$error = $conn->connect_error;
		goto end;
	}
	
	if ($_POST['action']) {
		$accepted = $_POST['action'] == 'Accept' ? 1 : 0;
		if ($_POST['email_id']) {
			$sql = "update email set accepted = $accepted where id = ?";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param('i', $_POST['email_id']);
		} else if ($_POST['email_reset_id']) {
			$sql = "update email_reset set accepted = $accepted where id = ?";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param('i', $_POST['email_reset_id']);
		}
		if (!$stmt->execute()) {
			$error = $conn->error;
			goto end;
		}
	}

	$sql = "SELECT * from email where accepted is NULL;";
	$stmt = $conn->prepare($sql);
	if ($conn->error) {
		$error = $conn->error;
		goto end;
	}
	$stmt->execute();
	$resRequests = $stmt->get_result();

	$sql = "SELECT email.email as email, email_reset.pwd as pwd, email_reset.del as del, email_reset.id as id, email_reset.ts as ts from email_reset left join email on email_reset.email_id = email.id where email.accepted is not null and email_reset.accepted is null;";
	$stmt = $conn->prepare($sql);
	if ($conn->error) {
		$error = $conn->error;
		goto end;
	}
	$stmt->execute();
	$resResets = $stmt->get_result();

end:
	if (isset($error)) {
		echo "<p style='padding: 5px; background-color: #faa;'>$error</p>";
		goto finalEnd;
	} 
?>
	<h2>New Requests</h2>
	<table>
	<tr><th>Email</th><th>Password</th><th>Recovery Email</th><th>Time</th><th>Action</th></tr>
<?
	while ($row = $resRequests->fetch_assoc()) {
		echo "<tr><td>".$row['email']."</td>";
		echo "<td>".$row['pwd']."</td>";
		echo "<td>".$row['recovery_email']."</td>";
		echo "<td>".$row['ts']."</td>";
		echo "<td><button data-email-id='".$row['id']."'>Accept</button><button data-email-id='".$row['id']."'>Reject</button></td></tr>\n";
	}
?>
	</table>
	<h2>New Resets</h2>
	<table>
	<tr><th>Email</th><th>Password</th><th>Delete</th><th>Time</th><th>Action</th></tr>
<?
	while ($row = $resResets->fetch_assoc()) {
		echo "<tr><td>".$row['email']."</td>";
		echo "<td>".$row['pwd']."</td>";
		echo "<td>".$row['del']."</td>";
		echo "<td>".$row['ts']."</td>";
		echo "<td><button data-email-reset-id='".$row['id']."'>Accept</button><button data-email-reset-id='".$row['id']."'>Reject</button></td></tr>\n";
	}
?>
	</table>
<?
finalEnd:
?>
</body>
</html>
