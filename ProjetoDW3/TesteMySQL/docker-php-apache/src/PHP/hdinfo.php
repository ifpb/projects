
<?php

$hdinfo = shell_exec("df -H | grep sd | tr '\n' ' '");

$hdvalores = preg_split('/\s+/', $hdinfo);

$hdresult = json_encode([
    'SistArq' => $hdvalores[0],
    'Tam' => $hdvalores[1],
    'Usado' => $hdvalores[2],
    'Disp' => $hdvalores[3],
    'Uso' => $hdvalores[4],
    'MontadoEm' => $hdvalores[5]
]);

$file = fopen('../JSON/diskusage.json','w+') or die("File not found");
fwrite($file, $hdresult);
fclose($file);

?>