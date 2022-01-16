<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Pitch Shifting Proof of Concept</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Pitch-shifting specific -->
    <script src="script/FFT.js"></script>
    <script src="script/PitchShifter.js"></script>
    <script src="script/PitchShifting.js"></script>
    <link rel="stylesheet" href="style/PitchShifting.css">
</head>
<body onload="init()">
    <h1>Pitch Shifting Proof of Concept</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
            <p id="info-p"></p>
            <div id="top-container-div">
                <table>
                    <tr>
                        <td><label for="sound-file-select">Sound File:</label></td>
                        <td><select id="sound-file-select"></select></td>
                        <td><button onclick="loadSound()">Load Sound</button></td>
                        <td><button onclick="playOriginal()">Play Original</button></td>
                    </tr>
                    <tr>
                        <td>
                            <label for="pitch-shift-factor-range">
                                Pitch Shift Factor:</label>
                        </td>
                        <td style="text-align: center;">
                            <input type="range" min="-30" max="30" value="0" 
                                step="1" id="pitch-shift-factor-range"><br>
                            <span id="pitch-shift-factor-span">1</span>
                        </td>
                        <td><button onclick="pitchShift()">Pitch Shift</button></td>
                        <td><button onclick="playShifted()">Play Shifted</button></td>
                    </tr>
                </table>
                <div id="sound-file-stats-div">
                    Length: <span id="buffer-length-span"></span><br>
                    Sampling Rate: <span id="sampling-rate-span"></span><br>
                    Num Channels: <span id="num-channels-span"></span>
                </div>
            </div>
            <p>
                Using a 1024 sample Frame Size. 
                Directions: click and drag in the time canvas to change position.</p>
            <div>
                <em>Time Domain</em><br>
                <canvas id="time-canvas" width="800px" height="200px"></canvas><br>
                <button onclick="moveToStart()">Move To Start</button>
                <button onclick="scrollTimeCanvas(-FRAME_SIZE)">&lt;</button>
                <button onclick="scrollTimeCanvas(FRAME_SIZE)">&gt;</button>
                Position: <span id="cursor-span"></span>
            </div>
            <br>
            <div>
                <em>Frequency Domain</em> (after Hann windowing)<br>
                <canvas id="freq-canvas" width="800px" height="200px"></canvas>
            </div>
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>