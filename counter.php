<?
    $servername = "localhost";
    $username = "calmprep_anton";
    $password = "MySQL1@bbb";
    $dbname = "calmprep_hunimal";
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    $sql = "UPDATE visitor_count SET count = count+1 WHERE idx = 1";
    $conn->query($sql);

    $sql = "SELECT count FROM visitor_count WHERE idx = 1";
    $result = $conn->query($sql);

    function likesToHunimal($likes) {
        if ($likes == 0) {
            return "&#x5500";
        }
        $hun = "";
        while ($likes > 0) {
            $digit = $likes % 100;
            if ($digit < 10) {
                $digit = "0$digit";
            }
            $hun = "&#x55$digit;$hun";
            $likes = intval($likes/100);
        }
        return $hun;
    }

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $visits = $row["count"];
        }
        //printf("%05d", $visits);
        echo likesToHunimal($visits);
    } else {
        echo "no results";
    }
    
    $conn->close();
?>
