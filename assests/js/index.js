const timesEl = document.getElementById("times");
const botãoEl = document.getElementById("teste");
const mainEl = document.querySelector("main");



function Time(nome, estado) {
    this.nome = nome;
    this.estado = estado;
    this.pontos = 0;
}
let times = [];


function Teste() {
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
    console.log(jogosIda);
    let jogosVolta = criarTabela(times, false);
    console.log(jogosVolta);
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

    return `${time1.nome} ${result1} X ${result2} ${time2.nome}`;

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
                rodada[j] += " (RODADA DUPLA)";
            }
        }
    }

}

function compararPontos(time1, time2) {
    if (time1.pontos !== time2.pontos) {
        return time2.pontos - time1.pontos;
    }
}



botãoEl.addEventListener("click", Teste);