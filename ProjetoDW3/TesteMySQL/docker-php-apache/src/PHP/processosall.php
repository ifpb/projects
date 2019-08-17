<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Document</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Ruda" rel="stylesheet">
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
  <link href="../CSS/home.css" rel="stylesheet">
</head>

<body>

<?php
function ps_encode2($result) {
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
    $processos = shell_exec("ps aux");
    $ps = ps_encode2($processos);
    $processosresult = json_encode($ps);


    $file = fopen('../JSON/processall.json','w+') or die("File not found");
    fwrite($file, $processosresult);
    fclose($file);
    
    
?>

  <nav class="navbar navbar-expand-lg navbar-light">
    <a class="navbar-brand" href="../HTML/home.html">SERVER MONITOR</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end admin-link" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a href="#">
            <i class="material-icons">date_range</i>
          </a>
        </li>
        <li class="nav-item">
          <a href="#">
            <i class="material-icons">notifications</i>
          </a>
        </li>
        <li class="nav-item">
          <a href="#">
            <img class="user" src="../IMG/admin.png" alt="admin">
          </a>
        </li>
    </div>
  </nav>
  <main class="container" id="res">
    <form action="../PHP/buscaprocesso.php">
      <div class="row justify-content-center">
        <div class="col-5">
          <input type="text" placeholder="Pesquisar" name="processo" class="form-control">
        </div>
        <div class="col-1">
          <button type="submit" class="btn">
            <i class="material-icons">search</i>
          </button>
        </div>

        <!--<form action="../PHP/processos.php">
          <input type="submit" value="Atualizar">
        </form>-->

      </div>
    </form>




        <section class="card">
          <header class="card-header btn btn-info"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> PROCESSOS</header>
          <main class="card-body">
            <h2 style="text-align:center;"></h2>
            <table id="top-process" class="table proall">
              <thead>
                <tr>
                  <th>PID</th>
                  <th>USER</th>
                  <th>CPU%</th>
                  <th>MEM%</th>
                  <th>Command</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </main>
        </section>


  </main>
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"
    integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ"
    crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"
    integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm"
    crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js"></script>
  <script src="../JAVASCRIPT/jason.js"></script>
  <script src="../JAVASCRIPT/mouseon.js"></script>
  <script src="../JAVASCRIPT/teste.js"></script>

</body>

</html>