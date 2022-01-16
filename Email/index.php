<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Email</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Email-specific -->
	<link rel="stylesheet" href="style/index.css">
	<script src="script/index.js"></script>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</head>
<body>
    <h1>Hunimal Email</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
			<p><a style="font-size: 20px;" href="/webmail">Go to email.</a></p>
<?
	include_once('reserved_emails.php');

	if ($_POST['action']) {
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
	
		// Look up email
		$email = $_POST['email'];
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$error = "Email $email is not a valid email";
			goto end;
		}

		// Check reserved list
		if (in_array($email, $reservedEmails)) {
			$error = "Email $email is a reserved email";
			goto end;
		}
		
		$sql = "SELECT * from email where email.email = ?";
		$stmt = $conn->prepare($sql);
		if ($conn->error) {
			$error = $conn->error;
			goto end;
		}
		$stmt->bind_param('s', $email);
		$stmt->execute();
		$res = $stmt->get_result();
		if (!$res) {
			$error = $conn->error;
			goto end;
		}
		if ($res->num_rows == 0 and $_POST['action'] != 'request') {
			$error = "No such email $email in system";
			goto end;
		}
		if ($res->num_rows > 1) {
			$error = "Database error, multiple emails $email@hunimal.org";
			goto end;
		}

		$row = $res->fetch_assoc();
	}

	if ($_POST['action'] == 'request') {
		if ($res->num_rows == 1) {
			$error = "Email $email already exists in system";
			goto end;
		}

		$recovery = $_POST['recovery-email'];
		if (!filter_var($recovery, FILTER_VALIDATE_EMAIL)) {
			$error = "Invalid email format for recovery email $recovery";
			goto end;
		}

		$pwd = $_POST['password'];
		$confirm = $_POST['confirm-password'];
		if (strlen($pwd) < 8) {
			$error = "Password must be at least 8 characters";
			goto end;
		}

		if ($pwd != $confirm) {
			$error = "Passwords do not match";
			goto end;
		}

		// Update in database
		$sql = "insert into email (email, pwd, recovery_email) values (?, ?, ?);";
		$stmt = $conn->prepare($sql);
		if ($conn->error) {
			$error = $conn->error;
			goto end;
		}
		$stmt->bind_param('sss', $email, $pwd, $recovery);
		$stmt->execute();
		if ($conn->error) {
			$error = $conn->error;
			goto end;
		}

		// Send email to me
		$to = "anton@hunimal.org";
		$subject = "Email request for $email";
		$message = "Email: $email\r\nRecovery: $recovery\r\nPassword: $pwd\r\n";
		$headers = "From: no-reply@hunimal.org\r\nX-Mailer: PHP/".phpversion();
		mail($to, $subject, $message, $headers);

		$info = "Password request made. Please allow 24 hours for your email to be activated.";
	}

	if ($_POST['action'] == 'reset') {
		$old = $_POST['old-password'];
		if ($old != $row['pwd']) {
			$error = "Invalid existing password";
			goto end;
		}

		$pwd = $_POST['new-password'];
		$confirm = $_POST['confirm-new-password'];
		if (strlen($pwd) < 8) {
			$error = "Password must be at least 8 characters";
			goto end;
		}

		if ($pwd != $confirm) {
			$error = "Passwords do not match";
			goto end;
		}
	
		// Update in database
		$sql = "insert into email_reset (email_id, pwd) values (?, ?);";
		$stmt = $conn->prepare($sql);
		if ($conn->error) {
			$error = $conn->error;
			goto end;
		}
		$stmt->bind_param('is', $row['id'], $pwd);
		$stmt->execute();
		if ($conn->error) {
			$error = $conn->error;
			goto end;
		}

		$recovery = $row['recovery_email'];
		
		// Send email to me
		$to = "anton@hunimal.org";
		$subject = "Email reset for $email";
		$message = "Email: $email\r\nRecovery: $recovery\r\nNew password: $pwd\r\n";
		$headers = "From: no-reply@hunimal.org\r\nX-Mailer: PHP/".phpversion();
		mail($to, $subject, $message, $headers);

		$info = "Reset request made. Please allow 24 hours for your password to be changed.";

	}

	if ($_POST['action'] == 'delete') {
		$pwd = $_POST['password'];
		if ($pwd != $row['pwd']) {
			$error = "Invalid existing password";
			goto end;
		}

		if (!$_POST['confirm']) {
			$error = "Please confirm deletion of your account";
			goto end;
		}
		
		// Update in database
		$sql = "insert into email_reset (email_id, del) values (?, true);";
		$stmt = $conn->prepare($sql);
		if ($conn->error) {
			$error = $conn->error;
			goto end;
		}
		$stmt->bind_param('i', $row['id']);
		$stmt->execute();
		if ($conn->error) {
			$error = $conn->error;
			goto end;
		}
		
		$recovery = $row['recovery_email'];
		
		// Send email to me
		$to = "anton@hunimal.org";
		$subject = "Delete email for $email";
		$message = "Email: $email\r\nRecovery: $recovery\r\n";
		$headers = "From: no-reply@hunimal.org\r\nX-Mailer: PHP/".phpversion();
		mail($to, $subject, $message, $headers);

		$info = "Delete request made. Please allow 24 hours for your @hunimal email to be deleted.";
	}

end: 
	if ($_POST['action']) {
		if (isset($error)) {
			echo "<p id='email-info-p' class='email-error'>$error</p>";
		} else if (isset($info)) {
			echo "<p id='email-info-p' class='email-info'>$info</p>";
		} else {
			echo "<p id='email-info-p' class='email-info'>No message</p>";
		}
	}
?>
			<div class='g-recaptcha' data-sitekey='6LeGMlccAAAAAKlt6fzXtA6HYoy4OSUCQalRuxZm' data-callback='unlock'></div>
			<h2>Request Email</h2>
			<p>Fill out the form below to request a @hunimal.org email account.</p>
			<form action="." method="post">
				<label for="email">Email:</label>
					<input type="text" name="email" value="<? echo $email; ?>"><br>
				<label for="recovery-email">Recovery Email:</label>
					<input type="text" name="recovery-email" value="<? echo $recovery; ?>"><br>
				<label for="password">Password:</label>
					<input type="password" name="password" value="<? echo $pwd; ?>"><br>
				<label for="confirm-password">Confirm Password:</label>
					<input type="password" name="confirm-password" value="<? echo $confirm; ?>"><br>
				<input type="hidden" name="action" value="request">
				<noscript>
					<p><strong>Javascript is required to use this form.</strong></p>
				</noscript>
				<div id='submit-request-div'></div>
				<!--<input type="submit" value="Request"><br>-->
			</form>
			<h2>Reset Email</h2>
			<p>Reset the password on your @hunimal.org email account.</p>
			<form action="." method="post">
				<label for="email">Email:</label>	
					<input type="text" name="email" value="<? echo $email; ?>"><br>
				<label for="old-password">Password:</label>
					<input type="password" name="old-password"><br>
				<label for="new-password">New Password:</label>
					<input type="password" name="new-password"><br>
				<label for="confirm-new-password">Confirm Password:</label>
					<input type="password" name="confirm-new-password"><br>
				<input type="hidden" name="action" value="reset">
				<noscript>
					<p><strong>Javascript is required to use this form.</strong></p>
				</noscript>
				<div id='submit-reset-div'></div>
				<!--<input type="submit" value="Reset"><br>-->
			</form>
			<h2>Delete Email</h2>
			<p>Delete (eek!) your @hunimal.org email account.</p>
			<form action="." method="post">
				<label for="email">Email:</label>	
					<input type="text" name="email" value="<? echo $email; ?>"><br>
				<label for="password">Password:</label>
					<input type="password" name="password"><br>
				<input type="checkbox" name="confirm">
					<label for="confirm">I wish to permenantly delete my @hunimal.org email account.</label><br>
				<input type="hidden" name="action" value="delete">
				<noscript>
					<p><strong>Javascript is required to use this form.</strong></p>
				</noscript>
				<div id='submit-delete-div'></div>
				<!--<input type="submit" value="Delete"><br>-->
			</form>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
