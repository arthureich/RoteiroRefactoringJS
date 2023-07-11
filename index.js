const { readFileSync } = require('fs');

class ServicoCalculoFatura {
   constructor(repo) {
     this.repo = repo;
  }
   calcularCredito(apre) {
     let creditos = 0;
      creditos += Math.max(apre.audiencia - 30, 0);
      if (this.repo.getPeca(apre).tipo === "comedia") 
         creditos += Math.floor(apre.audiencia / 5);
      return creditos;  
   }
   
   calcularTotalCreditos(fatura) {
      let total=0;
    for (let apre of fatura.apresentacoes) {
      total+= this.calcularCredito(apre);
    }
    return total;
   }
   
   calcularTotalApresentacao(apre) {
      let total = 0;
      switch (this.repo.getPeca(apre).tipo) {
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
          throw new Error(`Peça desconhecia: ${this.repo.getPeca(apre).tipo}`);
      }
   }
   
   calcularTotalFatura(fatura) {
       let total=0;
    for (let apre of fatura.apresentacoes) {
      total+= this.calcularTotalApresentacao(apre)
    }
    return total;
   }
}

class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
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

function gerarFaturaStr (fatura) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${calculo.repo.getPeca(apre).nome}: ${formatarMoeda(calculo.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
      calculo.calcularCredito(apre);
  }
  faturaStr += `Valor total: ${formatarMoeda(calculo.calcularTotalFatura(fatura))}\n`;
  faturaStr += `Créditos acumulados: ${calculo.calcularTotalCreditos(fatura)} \n`;
   return faturaStr;
  
}

function gerarFaturaHtml (fatura) {
    let faturaHtml = `<html>\n<p>Fatura ${fatura.cliente}</p>\n<ul>\n`;
    for (let apre of fatura.apresentacoes) {
      faturaHtml += `<li>${calculo.repo.getPeca(apre).nome}: ${formatarMoeda(calculo.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)</li>\n`;
      calculo.calcularCredito(apre);
  }
  faturaHtml += `</ul>\n<p>Valor total: ${formatarMoeda(calculo.calcularTotalFatura(fatura))}</p>\n`;
  faturaHtml += `<p>Créditos acumulados: ${calculo.calcularTotalCreditos(fatura)}</p>\n</html>`;
   return faturaHtml;
  
}



function main(){
    const faturas = JSON.parse(readFileSync('./faturas.json'));
    faturaStr = gerarFaturaStr(faturas);
    faturaHtml = gerarFaturaHtml(faturas);
    console.log(faturaStr);
    console.log(faturaHtml)
}

repo = new Repositorio();
calculo = new ServicoCalculoFatura(repo);
main();
