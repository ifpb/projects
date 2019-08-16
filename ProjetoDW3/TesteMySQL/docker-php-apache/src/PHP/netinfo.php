<?php

function net_encode($result) {
    $nets = [];
    $regex = "/(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)/";
    preg_match_all($regex, $result, $matches);
    foreach ($matches[1] as $index => $user) {
      $nets[] = [
        "Destino"    => $matches[1][$index],
        "Roteador"     => $matches[2][$index],
        "MascaraGen"     => $matches[3][$index],
        "Opcoes"     => $matches[4][$index],
        "MSS"     => $matches[5][$index],
        "Janela"     => $matches[6][$index],
        "irtt"     => $matches[7][$index],
        "Iface"    => $matches[8][$index],
      ];
    }
    return $nets;
}

$netinfo = shell_exec("netstat -nr | grep -v 'IP\|Dest'");
$net = net_encode($netinfo);
$netresult = json_encode($net);


$file = fopen('../JSON/network.json','w+') or die("File not found");
fwrite($file, $netresult);
fclose($file);

?>