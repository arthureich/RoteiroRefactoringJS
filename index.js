const { readFileSync } = require('fs');

class ServicoCalculoFatura {

   calcularCredito(pecas, apre) {
     let creditos = 0;
      creditos += Math.max(apre.audiencia - 30, 0);
      if (getPeca(pecas, apre).tipo === "comedia") 
         creditos += Math.floor(apre.audiencia / 5);
      return creditos;  
   }
   
   calcularTotalCreditos(pecas, fatura) {
      let total=0;
    for (let apre of fatura.apresentacoes) {
      total+= this.calcularCredito(pecas, apre);
    }
    return total;
   }
   
   calcularTotalApresentacao(pecas, apre) {
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
   
   calcularTotalFatura(pecas, fatura) {
       let total=0;
    for (let apre of fatura.apresentacoes) {
      total+= this.calcularTotalApresentacao(pecas, apre)
    }
    return total;
   }
}

function formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR",
        { style: "currency", currency: "BRL",
          minimumFractionDigits: 2 }).format(valor/100);
}

function getPeca(pecas, apresentacao) {
      return pecas[apresentacao.id];
}

function gerarFaturaStr (fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calculo.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
      calculo.calcularCredito(pecas, apre);
  }
  faturaStr += `Valor total: ${formatarMoeda(calculo.calcularTotalFatura(pecas, fatura))}\n`;
  faturaStr += `Créditos acumulados: ${calculo.calcularTotalCreditos(pecas, fatura)} \n`;
   return faturaStr;
  
}

function gerarFaturaHtml (fatura, pecas) {
    let faturaHtml = `<html>\n<p>Fatura ${fatura.cliente}</p>\n<ul>\n`;
    for (let apre of fatura.apresentacoes) {
      faturaHtml += `<li>${getPeca(pecas, apre).nome}: ${formatarMoeda(calculo.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)</li>\n`;
      calculo.calcularCredito(pecas, apre);
  }
  faturaHtml += `</ul>\n<p>Valor total: ${formatarMoeda(calculo.calcularTotalFatura(pecas, fatura))}</p>\n`;
  faturaHtml += `<p>Créditos acumulados: ${calculo.calcularTotalCreditos(pecas, fatura)}</p>\n</html>`;
   return faturaHtml;
  
}



function main(){
    const pecas = JSON.parse(readFileSync('./pecas.json'));
    const faturas = JSON.parse(readFileSync('./faturas.json'));
    faturaStr = gerarFaturaStr(faturas, pecas);
    faturaHtml = gerarFaturaHtml(faturas, pecas);
    console.log(faturaStr);
    console.log(faturaHtml)
}

calculo = new ServicoCalculoFatura();
main();
