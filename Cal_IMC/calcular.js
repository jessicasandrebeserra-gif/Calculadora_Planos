//função principal  chamada quando o botão "Calcular Planos" é clicado no HTML.
function calcularPlanos() {

     // Pega os valores inseridos nos campos do formulário.
     const idade = parseFloat(document.getElementById('idade').value);
     const peso = parseFloat(document.getElementById('peso').value);
     const altura = parseFloat(document.getElementById('altura').value);

     // Validação básica para garantir que os números são válidos e que a altura não é zero.
     if (isNaN(idade) || isNaN(peso) || isNaN(altura) || altura <= 0) {
          alert("Por favor, insira valores válidos para idade, peso e altura.");
          return; // Para a execução se os dados forem inválidos.
     }

     // Cálculo do IMC (IMC = Peso / (Altura * Altura).
     const imc = peso / (altura ** 2);

     // Determinar - Fator de Comorbidade (FC) ---
     // Chama a função auxiliar para obter o FC com base no IMC.
     const fc = determinarFatorComorbidade(imc);

     //Cálculo dos Preços A e B.
     // Calcula os 3 planos da Operadora A (usa idade e imc).
     const precosA = calcularPlanosA(idade, imc);

     // Calcula os 3 planos da Operadora B (usa fc e imc).
     const precosB = calcularPlanosB(fc, imc);

     // Combina todos os 6 preços em um único objeto para facilitar a comparação.
     const todosPrecos = { ...precosA, ...precosB };

     //Comparação e Determinação do Plano Mais Vantajoso
     const { nome, custo } = encontrarMelhorPlano(todosPrecos);

     //Exibir Resultados.
     // Chama a função para atualizar a interface do usuário (HTML) com todos os resultados.
     exibirResultados(imc, fc, todosPrecos, nome, custo);
}

//Mapeia o IMC ao Fator de Comorbidade conforme as regras do projeto.
function determinarFatorComorbidade(imc) {
     if (imc < 18.5) return 10;
     if (imc >= 18.5 && imc <= 24.9) return 1;   // Normal (FC=1, o menor)
     if (imc >= 25.0 && imc <= 29.9) return 6;   // Sobrepeso
     if (imc >= 30.0 && imc <= 34.9) return 10;  // Obesidade
     if (imc >= 35.0 && imc <= 39.9) return 20;  // Obesidade Grave
     // imc >= 40.0
     return 30; // Obesidade Mórbida (FC=30, o maior)
}

// Calcula os preços da Operadora A.
// A Operadora A usa a IDADE e o IMC.
function calcularPlanosA(idade, imc) {
     // Plano Básico A: 100 + (idade * 10) * (IMC / 10)
     const basico = 100 + (idade * 10) * (imc / 10);

     // Plano Standard A: (150 + (idade * 15)) * (imc / 10);
     const standard = (150 + (idade * 15)) * (imc / 10);

     // Plano Premium A: (200 - (imc * 10) + (idade * 20)) * (imc / 10);
     const premium = (200 + (imc * 10) + (idade * 20)) * (imc / 10);

     return {
          'A - Básico': basico,
          'A - Standard': standard,
          'A - Premium': premium
     };
}

//  Calcula os preços da Operadora B.
//  FATOR DE COMORBIDADE (FC) e o IMC.
function calcularPlanosB(fc, imc) {
     // Plano Básico B: 100 + (FC * 10* (IMC / 10))
     const basico = 100 + (fc * 10 * (imc / 10));

     // Plano Standard B: (150 + (fc * 15)) * (imc / 10);
     const standard = (150 + (fc * 15)) * (imc / 10);

     // Plano Premium B: (200 - (imc * 10) + (fc * 20)) * (imc / 10);
     const premium = (200 + (imc * 10) + (fc * 20)) * (imc / 10);

     return {
          'B - Básico': basico,
          'B - Standard': standard,
          'B - Premium': premium
     };
}

//  Percorre todos os preços e encontra o menor.
function encontrarMelhorPlano(precos) {
     let melhorPlanoNome = '';
     let menorCusto = Infinity; // Inicializa com o maior valor para a primeira comparação.

     // Itera sobre todas as chaves (nomes dos planos) no objeto 'precos'.
     for (const nome in precos) {
          // Verifica se o preço atual é menor que o menor custo encontrado até agora.
          if (precos[nome] < menorCusto) {
               menorCusto = precos[nome];
               melhorPlanoNome = nome;
          }
     }

     return { nome: melhorPlanoNome, custo: menorCusto };
}


//  Atualiza o HTML para mostrar os resultados ao usuário.
function exibirResultados(imc, fc, precos, melhorPlanoNome, melhorPlanoCusto) {

     // Atualiza os valores do IMC e FC.
     document.getElementById('resultado-imc').textContent = imc.toFixed(2); //  2 casas decimais.
     document.getElementById('resultado-fc').textContent = fc;

     // Atualiza o destaque do Plano Mais Vantajoso.
     document.getElementById('melhor-plano-nome').textContent = melhorPlanoNome;
     // Formata o custo como moeda (R$) com 2 casas decimais e vírgula.
     document.getElementById('melhor-plano-custo').textContent = `R$ ${melhorPlanoCusto.toFixed(2).replace('.', ',')}`;

     // Preenche a Tabela de Preços 
     const tabelaBody = document.querySelector('#tabela-precos tbody');
     tabelaBody.innerHTML = ''; // Limpa as linhas anteriores da tabela.

     const tiposPlano = ['Básico', 'Standard', 'Premium'];

     tiposPlano.forEach(tipo => {
          // Cria uma nova linha na tabela.
          const linha = tabelaBody.insertRow();

          //  Nome do Plano (Básico, Standard, Premium).
          linha.insertCell().textContent = tipo;

          // Operadora A
          const precoA = precos[`A - ${tipo}`];
          const cellA = linha.insertCell();
          cellA.textContent = `R$ ${precoA.toFixed(2).replace('.', ',')}`;
          // Se este for o plano mais barato, adiciona a classe CSS para destaque.
          if (`A - ${tipo}` === melhorPlanoNome) {
               cellA.classList.add('melhor-preco');
          }

          //  Operadora B
          const precoB = precos[`B - ${tipo}`];
          const cellB = linha.insertCell();
          cellB.textContent = `R$ ${precoB.toFixed(2).replace('.', ',')}`;
          // Se este for o plano mais barato, adiciona a classe CSS para destaque.
          if (`B - ${tipo}` === melhorPlanoNome) {
               cellB.classList.add('melhor-preco');
          }
     });
}