const timesEl = document.getElementById("times");
const botãoEl = document.getElementById("submit");
const mainEl = document.querySelector("main");
const tituleEL = document.getElementById("titulo");



function Time(nome, estado) {
    this.nome = nome;
    this.estado = estado;
    this.pontos = 0;
}
let times = [];
let resultados = [];


function gerarTabela() {
    const timesText = timesEl.value;
    let listaTimes = timesText.split("\n");
    listaTimes.forEach((e) => {
        let temp = e.split(";");
        times.push(new Time(temp[0], temp[1]));
    });

    function criarTabela(Times, eJogoEmCasa) {
        let tabela = [];
        let qntsTimes = Times.length;
        if (qntsTimes % 2 !== 0) {
            Times.push(new Time("Extra", "Extra"));
        }
        let metade = qntsTimes / 2;

        for (let i = 0; i < qntsTimes - 1; i++) {

            let rodada = [];
            let estadosDaRodada = [];

            for (let j = 0; j < metade; j++) {

                let time1 = Times[j];
                let time2 = Times[qntsTimes - 1 - j];

                if (time1.nome !== "Extra" && time2.nome !== "Extra") {
                    if (eJogoEmCasa) {
                        rodada.push(gerarResultado(time1, time2) + " - " + time1.estado);
                        estadosDaRodada.push(time1.estado);
                    } else {
                        rodada.push(gerarResultado(time1, time2) + " - " + time2.estado);
                        estadosDaRodada.push(time2.estado);
                    }
                }

            }
            checarRodadaDupla(rodada, estadosDaRodada);
            tabela.push(rodada);
            Times.splice(1, 0, Times.pop());

        }
        times.sort(compararPontos);
        return tabela;
    }




    let jogosIda = criarTabela(times, true);
    let jogosVolta = criarTabela(times, false);
    let tabelaCompleta = [...jogosIda, ...jogosVolta];

    mainEl.classList.add("container");
    mainEl.classList.add("grid");


    mainEl.innerHTML = tabelaParaHtml(tabelaCompleta);
    let botaoMostar = document.getElementById("simular");

    botaoMostar.addEventListener("click", mostrarResultados)

}

function gerarResultado(time1, time2) {
    const result1 = Math.floor(Math.random() * 5);
    const result2 = Math.floor(Math.random() * 5);

    if (result1 > result2) {
        times.find((time) => time === time1).pontos += 3;

    } else if (result1 < result2) {
        times.find((time) => time === time2).pontos += 3;

    } else {
        times.find((time) => time === time1).pontos += 1;
        times.find((time) => time === time2).pontos += 1;

    }

    return `${time1.nome} - ${result1} X ${result2} - ${time2.nome}`;

}

function checarRodadaDupla(rodada, estadosDaRodada) {
    let contador = [];
    for (const estado of estadosDaRodada) {
        contador[estado] = (contador[estado] || 0) + 1;
    }

    const estadosRepetidos = Object.keys(contador).filter(estado => contador[estado] > 1);

    for (let i = 0; i < estadosRepetidos.length; i++) {
        for (let j = 0; j < rodada.length; j++) {
            if (rodada[j].endsWith(estadosRepetidos[i])) {
                rodada[j] += " - (RODADA DUPLA)";
            }
        }
    }

}

function compararPontos(time1, time2) {
    if (time1.pontos !== time2.pontos) {
        return time2.pontos - time1.pontos;
    }
}

function tabelaParaHtml(tabela) {
    let tabelaHTML = "";
    for (let i = 0; i < tabela.length; i++) {
        if (i < (tabela.length / 2)) {
            tabelaHTML += `<div class="Rodada">
            <h1>Rodada ${i + 1} IDA </h1>`;
        } else {
            tabelaHTML += `<div class="Rodada">
            <h1>Rodada ${i + 1} VOLTA </h1>`;
        }
        for (let j = 0; j < tabela[i].length; j++) {
            let informações = tabela[i][j].split(" - ");
            resultados.push(informações[1]);
            tabelaHTML += `<div class="jogo">
            <p>${informações[0]} <span class="resultado">X</span> ${informações[2]}</p>
            <p>${informações[3]} `;
            if (informações.length > 4) {
                tabelaHTML += `<span class="hl">Rodada Dupla</span></p>
                </div>`;
            } else {
                tabelaHTML += `</p>
                </div>`;
            }

        }
        tabelaHTML += `</div>`;
    }
    tabelaHTML += `<button class="btn2" id="simular"><img src="assests/img/soccer_icon.svg" width="48" height="48">Simular Campeonato</button>`;
    return tabelaHTML;
}

function mostrarResultados() {
    let resultadosEl = document.querySelectorAll(".resultado");
    for (let i = 0; i < resultadosEl.length; i++) {
        resultadosEl[i].innerHTML = resultados[i];
    }
    tituleEL.innerHTML = `O time campeão é ${times[0].nome}, com ${times[0].pontos} pontos.`;
}

botãoEl.addEventListener("click", gerarTabela);