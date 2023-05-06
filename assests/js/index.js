const timesEl = document.getElementById("times");
const botãoEl = document.getElementById("submit");
const mainEl = document.querySelector("main");
const tituleEL = document.getElementById("titulo");

function Time(nome, estado) {
  // Construtor para criar objetos de times
  this.nome = nome;
  this.estado = estado;
  this.pontos = 0;
}
let times = []; // Array para armazenar os objetos de times
let resultados = []; // Array para armazenar os resultados dos jogos

function gerarTabela() {
  const timesText = timesEl.value; // Obtém o valor do elemento de entrada de texto
  let listaTimes = timesText.split("\n");
  listaTimes.forEach((e) => {
    // Itera sobre cada linha da lista de times
    let temp = e.split(";"); // Divide a linha em partes separadas pelo ponto e vírgula (;)
    times.push(new Time(temp[0], temp[1])); // Cria um objeto Time com o nome e estado e adiciona ao array de times
  });

  function criarTabela(Times, eJogoEmCasa) {
    let tabela = []; // Array para armazenar as rodadas da tabela
    let qntsTimes = Times.length;
    if (qntsTimes % 2 !== 0) {
      Times.push(new Time("Extra", "Extra")); // Adiciona um time extra caso a quantidade de times seja ímpar
    }
    let metade = qntsTimes / 2;

    for (let i = 0; i < qntsTimes - 1; i++) {
      // Loop para criar as rodadas

      let rodada = []; // Array para armazenar os jogos de uma rodada
      let estadosDaRodada = []; // Array para armazenar os estados dos times na rodada

      for (let j = 0; j < metade; j++) {
        // Loop para criar os jogos de cada rodada

        let time1 = Times[j]; // Pega o time na posição j
        let time2 = Times[qntsTimes - 1 - j]; // Pega o time na posição complementar

        if (time1.nome !== "Extra" && time2.nome !== "Extra") {
          // Verifica se os times são diferentes do time extra
          if (eJogoEmCasa) {
            rodada.push(gerarResultado(time1, time2) + " - " + time1.estado); // Adiciona o resultado do jogo com o estado do time1
            estadosDaRodada.push(time1.estado); // Adiciona o estado do time1 ao array de estados da rodada
          } else {
            rodada.push(gerarResultado(time1, time2) + " - " + time2.estado); // Adiciona o resultado do jogo com o estado do time2
            estadosDaRodada.push(time2.estado); // Adiciona o estado do time2 ao array de estados da rodada
          }
        }
      }
      checarRodadaDupla(rodada, estadosDaRodada); // Verifica se há rodada dupla e atualiza os jogos da rodada
      tabela.push(rodada); // Adiciona a rodada à tabela
      Times.splice(1, 0, Times.pop()); // Realiza uma permutação circular dos times para a próxima rodada
    }
    times.sort(compararPontos); // Ordena os times de acordo com os pontos
    return tabela; // Retorna a tabela de jogos
  }

  let jogosIda = criarTabela(times, true);
  let jogosVolta = criarTabela(times, false);
  let tabelaCompleta = [...jogosIda, ...jogosVolta]; // Combina as tabelas de ida e volta

  mainEl.classList.add("container");
  mainEl.classList.add("grid");

  tituleEL.classList.add("center");
  mainEl.innerHTML = tabelaParaHtml(tabelaCompleta); // Converte a tabela de jogos para HTML e insere no elemento <main>
  let botaoMostar = document.getElementById("simular");

  botaoMostar.addEventListener("click", mostrarResultados); // Adiciona um ouvinte de evento ao botão "simular" para mostrar os resultados
}

function gerarResultado(time1, time2) {
  // Função para gerar o resultado de um jogo entre dois times
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

  return `${time1.nome} - ${result1} X ${result2} - ${time2.nome}`; // Retorna a string com o resultado do jogo
}

function checarRodadaDupla(rodada, estadosDaRodada) {
  // Função para verificar se há rodada dupla
  let contador = [];
  for (const estado of estadosDaRodada) {
    contador[estado] = (contador[estado] || 0) + 1;
  }

  const estadosRepetidos = Object.keys(contador).filter(
    (estado) => contador[estado] > 1
  );

  for (let i = 0; i < estadosRepetidos.length; i++) {
    for (let j = 0; j < rodada.length; j++) {
      if (rodada[j].endsWith(estadosRepetidos[i])) {
        // Verifica se o jogo na posição j termina com o estado repetido
        rodada[j] += " - (RODADA DUPLA)"; // Adiciona a indicação de rodada dupla ao jogo
      }
    }
  }
}

function compararPontos(time1, time2) {
  // Função de comparação de pontos para a ordenação dos times
  if (time1.pontos !== time2.pontos) {
    return time2.pontos - time1.pontos; // Compara os pontos e retorna a diferença para a ordenação decrescente
  }
}

function tabelaParaHtml(tabela) {
  // Função para converter a tabela de jogos em HTML
  let tabelaHTML = "";
  for (let i = 0; i < tabela.length; i++) {
    if (i < tabela.length / 2) {
      tabelaHTML += `<div class="Rodada">
            <h1>Rodada ${i + 1} IDA </h1>`;
    } else {
      tabelaHTML += `<div class="Rodada">
            <h1>Rodada ${i + 1} VOLTA </h1>`;
    }
    for (let j = 0; j < tabela[i].length; j++) {
      let informações = tabela[i][j].split(" - ");
      resultados.push(informações[1]); // Adiciona o resultado do jogo ao array de resultados
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
  tabelaHTML += `<button class="btn2" id="simular"><img src="assests/img/soccer_icon.svg" width="48" height="48">Simular Campeonato</button>`; // Botão para simular o campeonato
  return tabelaHTML; // Retorna a tabela em formato HTML
}

function mostrarResultados() {
  // Função para mostrar os resultados na interface do usuário
  let resultadosEl = document.querySelectorAll(".resultado");
  for (let i = 0; i < resultadosEl.length; i++) {
    resultadosEl[i].innerHTML = resultados[i]; // Atualiza o conteúdo de cada elemento com o resultado correspondente
  }

  tituleEL.innerHTML = `O time campeão é ${times[0].nome}, com ${times[0].pontos} pontos.`; // Exibe o nome e os pontos do time campeão
}

botãoEl.addEventListener("click", gerarTabela);
