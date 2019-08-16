<?php

   $cpuinfo = [];

   $cpuinfo[0] = shell_exec("cat /proc/cpuinfo | grep -i 'vendor' | sort | uniq | sed 's/vendor_id\t: //' | tr '\n' ' '");
   $cpuinfo[1] = shell_exec("cat /proc/cpuinfo | grep -i 'model name' | sort | uniq | sed 's/model name\t: //' | tr '\n' ' '");

    //$cpuresult = json_encode([
    //    'fabricante' => $cpuinfo[0],
    //    'modelo' => $cpuinfo[1]
    //]);

    $cpuMHz = shell_exec("cat /proc/cpuinfo | grep -i 'mhz' | grep -v 'power' | sed 's/cpu MHz\t\t: //' | tr '\n' ' ' | sed 's/ /<br>/g'");

    $MHzresult = json_encode([
        'Fabricante' => $cpuinfo[0],
        'Modelo' => $cpuinfo[1],
        'MHz' => $cpuMHz
    ]);

    //$file = fopen('../JSON/cpu.json','w+') or die("File not found");
    //fwrite($file, $cpuresult);
    //fclose($file);

    $file = fopen('../JSON/cpu.json','w+') or die("File not found");
    fwrite($file, $MHzresult);
    fclose($file);


?>      