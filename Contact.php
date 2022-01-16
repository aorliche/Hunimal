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
		if (!$_POST['name']) {
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
			
			// Send email to David
			$to = "david@hunimal.org";
			$subject = "Hunimal Message from ".$_POST['name'];
			$message = $_POST['message'];
			$headers = "From: no-reply@hunimal.org\r\nReply-To: ".$_POST['email']."\r\nX-Mailer: PHP/".phpversion();
			mail($to, $subject, $message, $headers);

			echo '<p class="contact-info-p">Your message has been sent! Check your email for a reply from Anton or David.</p>';
		}
	}
?>
			<p id='js-contact-error-p'>You must complete the ReCAPTCHA to prove that you are a human</p>
			<p>Questions or comments? Fill out the form to contact David or Anton.</p>
			<form action='Contact.php' method='post' id='contact-form'>
				<label for='name'>Name:</label>
					<input type='text' name='name' value='<? echo $_POST['name'];?>'><br>
				<label for='email'>Email:</label>
					<input type='text' name='email' value='<? echo $_POST['email'];?>'><br>
				<label for='message'>Message:</label>
					<textarea name='message' form='contact-form'><? echo htmlspecialchars($_POST['message']); ?></textarea><br>
				<div class='g-recaptcha' data-sitekey='6LeGMlccAAAAAKlt6fzXtA6HYoy4OSUCQalRuxZm' data-callback='unlock'></div>
				<noscript>
					<p><strong>Javascript is required to use this form.</strong></p>
				</noscript>
				<div id='submit-div'></div>
			</form>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
