const { readFileSync } = require('fs');


function formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR",
        { style: "currency", currency: "BRL",
          minimumFractionDigits: 2 }).format(valor/100);
}

function getPeca(pecas, apresentacao) {
      return pecas[apresentacao.id];
}

function calcularCredito(pecas, apre) {
      let creditos = 0;
      creditos += Math.max(apre.audiencia - 30, 0);
      if (getPeca(pecas, apre).tipo === "comedia") 
         creditos += Math.floor(apre.audiencia / 5);
      return creditos;   
}

function calcularTotalCreditos(pecas, fatura){
    let total=0;
    for (let apre of fatura.apresentacoes) {
      total+= calcularCredito(pecas, apre);
    }
    return total;
}

function calcularTotalApresentacao(pecas, apre) {
      let total = 0;
      switch (getPeca(pecas, apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          return total += 1000 * (apre.audiencia - 30);
        }
        return total;
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
           total += 10000 + 500 * (apre.audiencia - 20);
        }
        return total += 300 * apre.audiencia;
        break;
      default:
          throw new Error(`Peça desconhecia: ${getPeca(pecas, apre).tipo}`);
      }
}

function calcularTotalFatura(pecas, fatura){
    let total=0;
    for (let apre of fatura.apresentacoes) {
      total+= calcularTotalApresentacao(pecas, apre)
    }
    return total;
}

function gerarFaturaStr (fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
      calcularCredito(pecas, apre);
  }
  faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura))}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura)} \n`;
   return faturaStr;
  
}

function main(){
    const pecas = JSON.parse(readFileSync('./pecas.json'));
    const faturas = JSON.parse(readFileSync('./faturas.json'));
    faturaStr = gerarFaturaStr(faturas, pecas);
    console.log(faturaStr);
}


main();
