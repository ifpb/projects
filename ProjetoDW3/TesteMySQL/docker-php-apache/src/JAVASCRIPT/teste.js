function teste() {
    res = document.getElementById("res")

    res.innerHTML = `
    <br><button type="button" class="btn btn-info"><a style="color:white; padding:auto;" href="javascript:window.history.go(0)">Back</a></button>
    <br>
    
    <div class="chart my-3">
        <canvas id="memory-chart" width="400" height="170" onload="loadMemoryChart()"></canvas>
    </div>`;
}
