//fetch
//generalinfo
fetch('../JSON/generalinfo.json')
    .then(r => r.json())
    .then(json => loadInfo(json))

function loadInfo(generalinfo) {
    var vid =1;
    const table = document.querySelector('table.info tbody');
    for (const field in generalinfo) {
        const row = `<tr><td>${field}:</td><td id="v${vid}">${generalinfo[field]} </td></tr>`;
        table.insertAdjacentHTML('beforeend', row);
        vid=vid +1;
    }
}

//cpu
/*
fetch('../JSON/MHz.json')
    .then(r => r.json())
    .then(json => loadCPU(json))

function loadCPU(cpu) {
    const table = document.querySelector('table.cpui tbody');
    for (cpui of cpu) {
        const view = `
        <td>${cpui.MHz}</td>
        `;
        table.insertAdjacentHTML('beforeend', view);
    }
    loadCPUChart([cpui.time, cpui.av].map(c => c.replace('%','')));
}*/

fetch('../JSON/cpu.json')
    .then(r => r.json())
    .then(json => loadCpu(json))

function loadCpu(cpu) {
    var vid2 =1;
    const table2 = document.querySelector('table.cpui tbody');
    for (const field2 in cpu) {
        const row = `<tr><td>${field2}:</td><td id="v${vid2}">${cpu[field2]} </td></tr>`;
        table2.insertAdjacentHTML('beforeend', row);
        vid2=vid2 +1;
    }
}
//memory
fetch('../JSON/memory.json')
    .then(r => r.json())
    .then(json => loadMemory(json))

function loadMemory(memory) {
    const table = document.querySelector('table.mem tbody');
    const row = `
    <tr>
    <td>${memory.used}</td>
    <td>${memory.total}</td>
    <td>${memory.available}</td>
    </tr>`;
    table.insertAdjacentHTML('beforeend', row);
    loadMemoryChart([memory.used, memory.free].map(c => c.replace('G','')));
}

//process
fetch('../JSON/process.json')
    .then(r => r.json())
    .then(json => loadProcess(json))

function loadProcess(process) {
    const table = document.querySelector('table.pro tbody');
    for (pro of process) {
        const view = `
        <tr>
        <td>${pro.pid}</td>
        <td>${pro.user}</td>
        <td>${pro.cpu}</td>
        <td>${pro.mem}</td>
        <td>${pro.command}</td>
        </tr>`;
        table.insertAdjacentHTML('beforeend', view);

    }
}

fetch('../JSON/processall.json')
    .then(r => r.json())
    .then(json => loadProcessall(json))

function loadProcessall(processall) {
    const table = document.querySelector('table.proall tbody');
    for (pro2 of processall) {
        const view = `
        <tr>
        <td>${pro2.pid}</td>
        <td>${pro2.user}</td>
        <td>${pro2.cpu}</td>
        <td>${pro2.mem}</td>
        <td>${pro2.command}</td>
        </tr>`;
        table.insertAdjacentHTML('beforeend', view);

    }
}

fetch('../JSON/buscaprocess.json')
    .then(r => r.json())
    .then(json => loadBuscaprocess(json))

function loadBuscaprocess(buscaprocess) {
    const table = document.querySelector('table.probusca tbody');
    for (pro3 of buscaprocess) {
        const view = `
        <tr>
        <td>${pro3.pid}</td>
        <td>${pro3.user}</td>
        <td>${pro3.cpu}</td>
        <td>${pro3.mem}</td>
        <td>${pro3.command}</td>
        </tr>`;
        table.insertAdjacentHTML('beforeend', view);

    }
}

//diskusage
/*fetch('../JSON/diskusage.json')
    .then(r => r.json())
    .then(json => loadDisk(json))

function loadDisk(diskusage) {
    const table = document.querySelector('table.hd tbody');
    for (hd of diskusage) {
        const view = `
        <tr>
        <td>${hd.Tam}</td>
        <td>${hd.Usado}</td>
        <td>${hd.SistArq}</td>
        </tr>`;
        table.insertAdjacentHTML('beforeend', view);
    }
}*/

fetch('../JSON/diskusage.json')
    .then(r => r.json())
    .then(json => loadDiskusage(json))

function loadDiskusage(diskusage) {
    const table = document.querySelector('table.hd tbody');
    const row = `
    <tr>
    <td>${diskusage.Tam}</td>
    <td>${diskusage.Usado}</td>
    <td>${diskusage.SistArq}</td>
    </tr>`;
    table.insertAdjacentHTML('beforeend', row);
}

//network
fetch('../JSON/network.json')
    .then(r => r.json())
    .then(json => loadNetwork(json))

function loadNetwork(network) {
    const table = document.querySelector('table.net tbody');
    for (net of network) {
        const view = `
        <tr>
        <td>${net.Destino}</td>
        <td>${net.Roteador}</td>
        <td>${net.Iface}</td>
        </tr>`;
        table.insertAdjacentHTML('beforeend', view);
    }
}

//GRÁFICOS
//MEMORY
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

//atualiza o local definido pela id
// var counter = 0;
// window.setInterval("refreshDiv()", 500);
// function refreshDiv() {
//     counter = counter + 1;
//     document.getElementById("v2").innerHTML = "" + counter;
// } 

