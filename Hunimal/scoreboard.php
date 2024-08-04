<? set_include_path('/home3/calmprepared/public_html/'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hunimal Quiz Scoreboard</title>
    <!-- Generic Hunimal -->
    <? include('generic.php'); ?>
    <!-- Hunimal-specific -->
	<link rel="stylesheet" href="style/index.css">
</head>
<body>
    <h1>Hunimal Quiz Improved Scoreboard</h1>
    <? include('menu.php'); ?>
    <div id="container">
        <? include('navbar.php'); ?>
        <div id="main">
            <p>Scoreboard for the improved hunimal quiz.</p>
            <table style='text-align: center;'>    
                <tr>    
                    <th>Name</th>                    
                    <th>Seconds</th>                 
                    <th>Correct</th>                 
                    <th>Tried</th>                   
                </tr>                                
<?php                                
    $servername = "localhost";       
    $username = "calmprep_anton";    
    $password = "MySQL1@bbb";        
    $dbname = "calmprep_hunimal";    
    $conn = new mysqli($servername, $username, $password, $dbname);    

    if ($conn->connect_error) {    
        die("Connection failed: " . $conn->connect_error);    
    }    

    $stmt = $conn->prepare('select name,seconds,correct,tried from quiz_times order by correct desc');    
    $stmt->execute();    
    $res = $stmt->get_result();    

    while (($row = $res->fetch_assoc())) {    
        echo "<tr><td>".$row['name']."</td><td>".$row['seconds']."</td><td>".$row['correct']."</td><td>".$row['tried']."</td></tr>";    
    }    
    ?>      
            </table>   
        </div>
    </div>
    <? include('footer.php'); ?>
</body>
</html>
