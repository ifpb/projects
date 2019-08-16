<?php

$generalinfo = shell_exec("lsb_release -a 2> /dev/null | cut -d: -f2 | tr '\n' ' '");

$general = explode("\t", $generalinfo);

$generalresult = json_encode([
    'DistribuitorID' => $general[1],
    'Description' => $general[2],
    'Release' => $general[3],
    'Codename' => $general[4],
]);

$file = fopen('../JSON/generalinfo.json','w+') or die("File not found");
fwrite($file, $generalresult);
fclose($file);

?>