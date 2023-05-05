const teste = `Vasco;Rio de Janeiro
Flamengo;Rio de Janeiro
Palmeiras;São Paulo
Santos;São Paulo
Cruzeiro;Minas Gerais
Internacional;Rio Grande do Sul`;

function Time(nome, estado) {
    this.nome = nome;
    this.estado = estado;
}
let times = [];

let separado = teste.split("\n");
separado.forEach((e) => {
    let temp = e.split(";");
    times.push(new Time(temp[0], temp[1]));
});