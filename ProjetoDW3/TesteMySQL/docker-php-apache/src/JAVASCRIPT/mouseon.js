function mouseon() {
    res = document.getElementById("res")

    res.innerHTML = `
    <br><button type="button" class="btn btn-info"><a style="color:white; padding:auto;" href="javascript:window.history.go(0)">Back</a></button>
    <br>
    
    <div class="chart my-3">
        <canvas id="memory-chart" width="400" height="170" onload="loadMemoryChart()"></canvas>
    </div>`;
}
function loadMemoryChart(values) {
    const ctx = document.getElementById('memory-chart').getContext('2d');
    const data = {
      datasets: [
        {
          data: values,
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        },
      ],
      labels: ['Used', 'Free'],
    };
    const options = {};
    const config = {
      type: 'pie',
      data: data,
      options: options,
    };
    const myChart = new Chart(ctx, config);
}
