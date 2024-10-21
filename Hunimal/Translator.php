<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Translator Game</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Translator-specific -->
    <script src="script/Translator.js"></script>
    <script src="script/CheckButton.js"></script>
    <link rel="stylesheet" href="style/Translator.css">
</head>
<body>
    <h1>Hunimal Translator Game</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
            <p>Convert the number on the left, from the representation system selected for the left, to the representation system selected for the right.
            </p>
			<table id="hunimal-list-table"></table>
			<table id="cienimal-list-table"></table>
			<table id="sotimal-list-table"></table>
            <table id="dertimal-list-table"></table>
            <table id="korimal-list-table"></table>
			<div id='reload-div'>
				<a style="color: red;" onclick="reload();">New Word</a>
				<a id="hunimal-list-a" style='font-size: 14px;'>View Hunimals</a>
				<a id="cienimal-list-a" style='font-size: 14px;'>View Cienimals</a>
				<a id="sotimal-list-a" style='font-size: 14px;'>View Sotimals</a>
				<a id="dertimal-list-a" style='font-size: 14px;'>View Dertimals</a>
				<a id="korimal-list-a" style='font-size: 14px;'>View Korimals</a>
			</div>
            <div id="from-to-container">
                    <div id="feedback-container">
                        <div id="feedback-correct">
                            <div>Correct!</div>
							<a onclick="reload();">New Word</a>
                        </div>
                        <div id="feedback-incorrect">
                            <div id='correction-div'>Incorrect!</div>
							<a onclick="displayCorrect();">Display Correct</a>
                        </div>
                    </div>
                <div class="from-to-box">
                    <h1>From</h1>
                    <div class="options-list" style='display: inline-flex; flex-wrap: wrap;'>
                        <check-button name="left-option" id="left-decimal">Decimal</check-button>
                        <check-button name="left-option" id="left-hunimal" checked>Hunimal</check-button>
						<check-button name="left-option" id="left-cienimal">Cienimal</check-button>
						<check-button name="left-option" id="left-sotimal">Sotimal</check-button>
                        <check-button name="left-option" id="left-hex">Hex</check-button>
                        <check-button name="left-option" id="left-octal">Octal</check-button>
                        <check-button name="left-option" id="left-binary">Binary</check-button>
                    </div>
                    <p>Modality:</p>
                    <div class="options-list">
                        <check-button name="left-mod-option" id="left-digits">Digits</check-button>
                        <check-button name="left-mod-option" id="left-words" checked>Words</check-button>
                        <check-button name="left-mod-option" id="left-speech" disabled>Speech</check-button>
                    </div>
                    <div id="question-div">
                        Frun
                    </div>
                </div>
                <div class="from-to-box">
                    <h1>To</h1>
                    <div class="options-list" style='display: inline-flex; flex-wrap: wrap;'>
                        <check-button name="right-option" id="right-decimal" checked>Decimal</check-button>
                        <check-button name="right-option" id="right-hunimal">Hunimal</check-button>
						<check-button name="right-option" id="right-cienimal">Cienimal</check-button>
						<check-button name="right-option" id="right-sotimal">Sotimal</check-button>
                        <check-button name="right-option" id="right-hex">Hex</check-button>
                        <check-button name="right-option" id="right-octal">Octal</check-button>
                        <check-button name="right-option" id="right-binary">Binary</check-button>
                    </div>
                    <p>Modality:</p>
                    <div class="options-list">
                        <check-button name="right-mod-option" id="right-digits" checked>Digits</check-button>
                        <check-button name="right-mod-option" id="right-words">Words</check-button>
                        <check-button name="right-mod-option" id="right-speech" disabled>Speech</check-button>
                    </div>
                    <div id="answer-div">
                        <input type="text" id="answer-input" autofocus>
                        <!--<button onclick="checkAnswer();">Submit</button>-->
                        <p><em>Press Enter to submit</em></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
