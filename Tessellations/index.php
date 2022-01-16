<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
    <head>
        <title>Tessellations</title>
        <!-- Generic Hunimal -->
        <? include('generic.php'); ?>
        <!-- Tessellation-specific -->
        <script type="text/javascript" src="script/333333.js"></script>
        <script type="text/javascript" src="script/33434.js"></script>
        <script type="text/javascript" src="script/33344.js"></script>
        <script type="text/javascript" src="script/4444.js"></script>
        <script type="text/javascript" src="script/3464.js"></script>
        <script type="text/javascript" src="script/4612.js"></script>
        <script type="text/javascript" src="script/3636.js"></script>
        <script type="text/javascript" src="script/3366.js"></script>
        <script type="text/javascript" src="script/666.js"></script>
        <script type="text/javascript" src="script/33336.js"></script>
        <script type="text/javascript" src="script/31212.js"></script>
        <script type="text/javascript" src="script/333333_33336.js"></script>
        <script type="text/javascript" src="script/333333_3366.js"></script>
        <script src="script/99other.js"></script>
        <script src="script/collection.js"></script>
        <script type="text/javascript" src="script/color.js"></script>
        <script type="text/javascript" src="script/edge.js"></script>
        <script src="script/mega.js"></script>
        <script type="text/javascript" src="script/polygon.js"></script>
        <script type="text/javascript" src="script/save.js"></script>
        <script type="text/javascript" src="script/split.js"></script>
        <script type="text/javascript" src="script/tessellation.js"></script>
        <script type="text/javascript" src="script/util.js"></script>
        <script type="text/javascript" src="script/vertex.js"></script>
        <script type="text/javascript" src="script/zoom.js"></script>
        <link rel="stylesheet" type="text/css" href="style/tessellation.css">
    </head>
    <body onload="start()">
        <h1>Tessellations</h1>
        <? include('menu.php'); ?>
        <div id="container">
            <? include('navbar.php'); ?>
            <div id="main">
                <p>Tessellate the plane.</p>
                <canvas id="canvas" width="800" height="800" tabindex="0"></canvas>
                <div id="right" style="height: 800px; overflow-y: scroll;">
                    <div>
                        X: <input type='text' size='4' id='x-field'>
                        Y: <input type='text' size='4' id='y-field'>
                    </div>
                    <div class="action-group">
                        <input type="checkbox" id="allow-translation-checkbox" checked>Allow Translation<br>
                        <input type="checkbox" id="allow-zoom-checkbox">Allow Zoom<br>
                    </div>
                    <div class="action-group">
                        Select:<br>
                        <input type="radio" name="select-radio-group" id="select-polygon-radio" checked> Select Polygon<br>
                        <input type="radio" name="select-radio-group" id="select-edge-radio"> Select Edge<br>
                        <input type="radio" name="select-radio-group" id="select-stroke-radio"> Select Stroke<br>
                    </div>
                    <div class="action-group">
                        <button style="float: right;" onclick="megaTessellate();">Mega Tessellation</button>
                        Tessellate the Plane:<br>
                        Side Length: <input type="text" size="4" value="50" id="side-length-field"><br>
                        Iterations: <input type="text" size='4' value='2' id='iter-field'><br>
                        Vertex Type:<br>
                        <div>
                            <div style='float: right; width: 100px; padding-right: 80px'>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.6.3.6"> 3.6.3.6<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.3.6.6"> 3.3.6.6<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="6.6.6"> 6.6.6<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.3.6"> 3.3.3.3.6<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.12.12"> 3.12.12<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.3.4.12"> 3.3.4.12<br>
                            </div>
                            <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.3.3.3"> 3.3.3.3.3.3<br>
                            <input type="radio" checked name="vertexTypeRadioGroup" id="3.3.4.3.4"> 3.3.4.3.4<br>
                            <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.4.4"> 3.3.3.4.4<br>
                            <input type="radio" name="vertexTypeRadioGroup" id="4.4.4.4"> 4.4.4.4<br>
                            <input type="radio" name="vertexTypeRadioGroup" id="3.4.6.4"> 3.4.6.4<br>
                            <input type="radio" name="vertexTypeRadioGroup" id="4.6.12"> 4.6.12<br>
                        </div>
                        <hr>
                        Biform Vertex Type:
                        <div>
                            <div style='float: right; width: 140px; padding-right: 20px'>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.3.3.3_3.3.3.3.6_1"> 3(6)_3(4)6<sup>1</sup><br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.3.3.3_3.3.3.3.6_2"> 3(6)_3(4)6<sup>2</sup><br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.3.3.3_3.3.6.6"> 3(6)_3(2)6(2)<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.3.3.3_3.3.4.12"> 3(6)_3(2)4.12<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.4.6.4_3.3.3.4.4"> 3.4.6.4_3(3)4(2)<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.3.6.6_3.3.3.3.6"> 3(2)6(2)_3(4)6<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.4.4.6_3.4.6.4"> 3.4.4.6_3.4.6.4<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.4.3.3.4_3.4.6.4"> 3.4.3(2)4_3.4.6.4<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.12.12_3.4.3.12"> 3.12(2)_3.4.3.12<br>
                                <input type="radio" name="vertexTypeRadioGroup" id="3.4.6.4_4.12.6"> 3.4.6.4_4.12.6<br>
                            </div>
                            <input type="radio" name="vertexTypeRadioGroup" id="4.4.4.4_3.3.3.4.4_1"> 4(4)_3(3)4(2)<sup>1</sup><br>
                            <input type="radio" name="vertexTypeRadioGroup" id="4.4.4.4_3.3.3.4.4_2"> 4(4)_3(3)4(2)<sup>2</sup><br>
                            <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.3.3.3_3.3.3.4.4_1"> 3(6)_3(3)4(2)<sup>1</sup><br>
                            <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.3.3.3_3.3.3.4.4_2"> 3(6)_3(3)4(2)<sup>2</sup><br>
                            <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.3.3.3_3.3.4.3.4"> 3(6)_3(2)4.3.4<br>
                            <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.4.4_3.3.4.3.4_1"> 3(3)4(2)_3(2)4.3.4<sup>1</sup><br>
                            <input type="radio" name="vertexTypeRadioGroup" id="3.3.3.4.4_3.3.4.3.4_2"> 3(3)4(2)_3(2)4.3.4<sup>2</sup><br>
                            <input type="radio" name="vertexTypeRadioGroup" id="4.4.3.6_6.3.6.3_1"> 4(2)3.6_6.3.6.3<sup>1</sup><br>
                            <input type="radio" name="vertexTypeRadioGroup" id="4.4.3.6_6.3.6.3_2"> 4(2)3.6_6.3.6.3<sup>2</sup><br>
                            <input type="radio" name="vertexTypeRadioGroup" id="3.3.6.6_6.3.6.3"> 3(2)6(2)_6.3.6.3<br>
                        </div>
                        <hr>
                        <input type="button" value="Tessellate" onclick="tessellate()">
                    </div>
                    <div class="action-group">
                        Color Polygons:<br>
                        Polygon Type: 
                        <select id="polygon-color-select">
                            <option>Triangle</option>
                            <option>Square</option>
                            <option>Hexagon</option>
                            <option>Dodecagon</option>
                            <option>All Polys</option>
                        </select><br>
                        <input type="button" value="Select" onclick="selectPolygonType()">
                        <input type="button" value="Deselect All" onclick="selectPolygonType(true)"><br>
                        Color: <input type="text" size="4" id="polygon-color-input" value="#f00">
                        <input type="checkbox" checked id="apply-color-checkbox"> Apply Color<br>
                        Alpha: <input type="text" size="4" id="polygon-alpha-input" value="1.0">
                        <input type="checkbox" checked id="apply-alpha-checkbox"> Apply Alpha<br>
                        <input type="button" value="Apply Color" onclick="applyColor()">
                        <input type="button" value="Random Colors" onclick="applyColor(true)">
                    </div>
                    <div class="action-group">
                        Place Polygon:<br>
                        (Select an edge to place a polygon at that edge)<br>
                        <input type="radio" name="place-polygon-radio-group" id="place-triangle-radio" checked> Triangle (Shortcut T)<br>
                        <input type="radio" name="place-polygon-radio-group" id="place-square-radio"> Square (Shortcut S)<br>
                        <input type="radio" name="place-polygon-radio-group" id="place-hexagon-radio"> Hexagon (Shortcut H)<br>
                        <input type="radio" name="place-polygon-radio-group" id="place-dodecagon-radio"> Dodecagon (Shortcut D)<br>
                        <div>
                            <div style="float: left;">
                                <input type="radio" name="place-polygon-radio-group" id="place-other-radio"> Other
                            </div>
                            <div style="float: right;">
                                # of Sides: <input type="text" size="4" id="num-sides-field" value="5"><br>
                            </div>
                            <div style="width: 100%; clear: both;">
                                <input type="button" value="Place" onclick="doPlacePoly()"> (Shortcut Space)
                            </div>
                        </div>
                    </div>
                    <div class="action-group">
                        <input type="button" value="Split Polygon" onclick="doSplitPolys()">
                        <input type="button" value="Delete Polygon" onclick="doDeletePolys()">
                    </div>
                    <div class="action-group">
                        <input type="checkbox" id="display-vertices-checkbox" checked> Display Vertices<br>
                        <input type="checkbox" id="display-vertex-numbers-checkbox" checked> Display Vertex Numbers<br>
                        <input type="checkbox" id="display-lines-checkbox" checked> Display Lines
                    </div>
                    <div class="action-group">
                        Save and Restore:<br>
                        <input type="button" value="Save" onclick="save()">
                        <table id="saved-tessellations-table"></table>
                        Load File: <input type="file" id="file-input">
                    </div>
                    <div class="action-group">
                        Tessellation Collections:<br>
                        Iterations: <input type="text" size='4' value='2' id='tc-iter-field'><br>
                        <input type="radio" name="tc-edge-radio-group" id="north-tc-edge-radio" checked> North
                        <input type="radio" name="tc-edge-radio-group" id="south-tc-edge-radio"> South
                        <input type="radio" name="tc-edge-radio-group" id="east-tc-edge-radio"> East
                        <input type="radio" name="tc-edge-radio-group" id="west-tc-edge-radio"> West<br>
                        <input type="button" value="Add Edge" onclick="addTcEdge()">
                        <input type="button" value="Clear Edges" onclick="initTcEdges()">
                        <input type="button" value="Tess From Edges" onclick="checkTc()"><br>
                        <div style="padding-top: 5px">Or select a TC by selecting polygons:</div>
                        <input type="button" value="Tess From Selection" onclick="tessellateSelection()">
                    </div>
                </div>
            </div>
        </div>
        <? include('footer.php'); ?>
    </body>
</html>