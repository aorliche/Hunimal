<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Alpha Songs</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Alpha-song specific -->
    <script src="script/FFT.js"></script>
    <script src="script/PitchShifter.js"></script>
    <script src="script/NoteShifter.js"></script>
    <script src="script/AlphaSongs.js"></script>
    <script src="script/2Wave.js"></script>
    <link rel="stylesheet" href="style/AlphaSongs.css">
</head>
<body onload="init();">
    <h1>Alphabet Songs</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
            <div id="controls-div">
                <p>
                    <em>Instructions:</em> Click on a letter and another letter to switch their positions.
                    You can drag letters around the page too.
                <p>
                    Add Rest:
                    <img src="image/eighth-rest.png" class="rest-img" height="30" onclick="addRest(1);">
                    <img src="image/quarter-rest.png" class="rest-img" height="30" onclick="addRest(2);">
                    <img src="image/half-rest.png" class="rest-img" height="30" onclick="addRest(4);">
                    Add Note:
                    <select id="add-note-select"></select>
                    <a id="add-note" href="#add-note" class="js-a" onclick="addNote();">Add</a>
                </p>
                <p>
                    <a id="reset" href="#reset" class="js-a" onclick="reset();">Reset</a>
                    <a id="play" href="#play" class="js-a" onclick="play();">Play</a>
                    <a id="stop" href="#stop" class="js-a" onclick="stop();">Stop</a>
                    |
                    <a id="save" href="#save" class="js-a" onclick="save();">Save</a>
                    <a id="download" href="#download" class="js-a" onclick="down();">Download</a><br>
                    Note: You must play a song before you can download it.
                </p>
                <p>
                    <a id="randomize-pitches" href="#randomize-pitches" class="js-a" onclick="randomizePitches();">Radnomize Pitches</a>
                    <a id="randomize-lengths" href="#randomize-lengths" class="js-a" onclick="randomizeLengths();">Randomize Lengths</a>
                    <a id="randomize-letters" href="#randomize-letters" class="js-a" onclick="randomizeLetters();">Randomize Letters</a>
                </p>
                <p>
                    Load AlphaSong:
                    <input id="file-input" type="file"><br>
                    <input id="load-all-input" type="radio" name="load-input" checked>Load all
                    <input id="load-letters-input" type="radio" name="load-input">Load letters only
                    <input id="load-pitches-lengths-input" type="radio" name="load-input">Load pitches/lengths only
                </p>
                <p>
                    <input id="move-before-input" type="radio" name="move-input">Move before
                    <input id="move-after-input" type="radio" name="move-input">Move after
                    <input id="move-replace-input" type="radio" name="move-input" checked>Replace
                </p>
            </div>
            <div id="alpha-main-div">
                <!--<div id="A.wav-div" class="letter-div">
                    <div class="note-length-div">
                        <img src="image/eighth.png" class="length-img" width="20">
                        <img src="image/quarter.png" class="length-img" width="20">
                        <img src="image/half.png" class="length-img" width="20">
                    </div>
                    <a href="#A.wav-div" class="js-a" onclick="remove('A.wav');">X</a><br>
                    <span class="letter">A</span>
                    <select class="letter-note-select">
                        <option>C</option>
                        <option>C#</option>
                        <option>D</option>
                        <option>D#</option>
                        <option>E</option>
                        <option>F</option>
                        <option>F#</option>
                        <option>G</option>
                        <option>G#</option>
                        <option>A</option>
                        <option>A#</option>
                        <option>B</option>
                    </select>
                </div>-->
            </div>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>