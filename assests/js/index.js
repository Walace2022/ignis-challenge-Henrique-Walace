const timesEl = document.getElementById("times");
const botãoEl = document.getElementById("teste");



function Time(nome, estado) {
    this.nome = nome;
    this.estado = estado;
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
            Times.push(new Time("Extra"));
        }
        let metade = qntsTimes / 2;

        for (let i = 0; i < qntsTimes - 1; i++) {

            let rodada = [];

            for (let j = 0; j < metade; j++) {

                let time1 = Times[j];
                let time2 = Times[qntsTimes - 1 - j];

                if (time1.nome !== "Extra" && time2.nome !== "Extra") {
                    if (eJogoEmCasa) {
                        rodada.push(time1.nome + " X " + time2.nome + " - " + time1.estado);
                    } else {
                        rodada.push(time1.nome + " X " + time2.nome + " - " + time2.estado);
                    }
                }

            }
            tabela.push(rodada);
            Times.splice(1, 0, Times.pop());

        }

        return tabela;
    }




    let jogosIda = criarTabela(times, true);
    console.log(jogosIda);
    let jogosVolta = criarTabela(times, false);
    console.log(jogosVolta);
}


botãoEl.addEventListener("click", Teste);