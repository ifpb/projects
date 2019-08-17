<?php
function ps_encode($result) {
    $processes = [];
    $regex = "/\n(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)/";
    preg_match_all($regex, $result, $matches);
    foreach ($matches[1] as $index => $user) {
      $processes[] = [
        "user"    => $matches[1][$index],
        "pid"     => $matches[2][$index],
        "cpu"     => $matches[3][$index],
        "mem"     => $matches[4][$index],
        "vsz"     => $matches[5][$index],
        "rss"     => $matches[6][$index],
        "tty"     => $matches[7][$index],
        "stat"    => $matches[8][$index],
        "start"   => $matches[9][$index],
        "time"    => $matches[10][$index],
        "command" => $matches[11][$index],
      ];
    }
    return $processes;
}
    $processos = shell_exec("ps aux | head -5");
    $ps = ps_encode($processos);
    $processosresult = json_encode($ps);


    $file = fopen('../JSON/process.json','w+') or die("File not found");
    fwrite($file, $processosresult);
    fclose($file);
    
?>