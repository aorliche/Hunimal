<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Contact Hunimal</title>
    <? include('generic.php'); ?>
	<link rel='stylesheet' href='style/contact.css'>
	<script src='script/contact.js'></script>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</head>
<body>
    <h1>Hunimal.org</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
            <h2>Contact Form</h2>
<?
	if ($_POST['name'] or $_POST['email'] or $_POST['message']) {
		$sitekey = '6Lfas6IeAAAAAF2xcFZqf2cPBU2lQBB5GQAoTS2o';
		$secretkey = '6Lfas6IeAAAAABwITN4t6yyg0TQnAWngMROlo9gl';
		$token = $_POST['g-recaptcha-response'];
		$remote = $_SERVER['REMOTE_ADDR'];

		if (!$token) {
			echo '<p class="contact-err-p">Token not sent.</p>';
		}

		$postdata = http_build_query(
			array(
				'secret' => $secretkey,
				'response' => $token,
				'remoteip' => $remote
			)
		);

		$opts = array('http' => array(
			'method' => 'POST',
			'header' => 'content-type: application/x-www-form-urlencoded',
			'content' => $postdata
		));

		$context = stream_context_create($opts);
		$result = json_decode(file_get_contents(
			'https://www.google.com/recaptcha/api/siteverify', false, $context));
		if (!$result->success) {
			echo '<p class="contact-err-p">ReCaptcha error: '.json_encode($result->{'error_codes'}).'</p>';
		} else if (!$_POST['name']) {
			echo '<p class="contact-err-p">Please provide a name.</p>';
		} else if (!$_POST['email'] or !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
			echo '<p class="contact-err-p">Invalid email.</p>';
		} else if (!trim($_POST['message'])) {
			echo '<p class="contact-err-p">Message not filled out.</p>';
		} else {
			// Send email to me
			$to = "anton@hunimal.org";
			$subject = "Hunimal Message from ".$_POST['name'];
			$message = $_POST['message'];
			$headers = "From: no-reply@hunimal.org\r\nReply-To: ".$_POST['email']."\r\nX-Mailer: PHP/".phpversion();
			mail($to, $subject, $message, $headers);
			
		/*	// Send email to David
			$to = "david@hunimal.org";
			$subject = "Hunimal Message from ".$_POST['name'];
			$message = $_POST['message'];
			$headers = "From: no-reply@hunimal.org\r\nReply-To: ".$_POST['email']."\r\nX-Mailer: PHP/".phpversion();
			mail($to, $subject, $message, $headers);*/

			echo '<p class="contact-info-p">Your message has been sent! Check your email for a reply from Anton or David.</p>';
		}
	}
?>
<!--			<p id='js-contact-error-p'>You must complete the ReCAPTCHA to prove that you are a human</p>-->
			<p>Questions or comments? Fill out the form to contact David or Anton.</p>
			<form action='Contact.php' method='post' id='contact-form'>
				<label for='name'>Name:</label>
					<input type='text' name='name' value='<? echo $_POST['name'];?>'><br>
				<label for='email'>Email:</label>
					<input type='text' name='email' value='<? echo $_POST['email'];?>'><br>
				<label for='message'>Message:</label>
					<textarea name='message' form='contact-form'><? echo htmlspecialchars($_POST['message']); ?></textarea><br>
<!--<div class='g-recaptcha' data-sitekey='6LeGMlccAAAAAKlt6fzXtA6HYoy4OSUCQalRuxZm' data-callback='unlock'></div>-->
<!--				<noscript>
					<p><strong>Javascript is required to use this form.</strong></p>
				</noscript>
				<div id='submit-div'></div>-->
				<button class='g-recaptcha' 
						data-sitekey='6Lfas6IeAAAAAF2xcFZqf2cPBU2lQBB5GQAoTS2o' 
						data-callback='onSubmit' 
						data-action='submit'>Submit</button>
			</form>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
