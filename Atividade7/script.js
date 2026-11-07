 let pontosJogador = 0;
 let pontosComputador = 0;
 let pontosEmpates = 0;
 let rodada = 0;
 let jogando = false;

 let opcoes = ["pedra", "papel", "tesoura"];
 let emojis = ["✊", "✋", "✌️"];

 let imagens = [
     "https://openclipart.org/image/800px/34093",
     "https://openclipart.org/image/800px/32731",
     "https://openclipart.org/image/800px/34231"
 ];

 function nomeBonito(nome) {
     return nome.charAt(0).toUpperCase() + nome.slice(1);
 }

 function atualizarPlacar() {
     document.getElementById("pontos-jogador").textContent = pontosJogador;
     document.getElementById("pontos-computador").textContent = pontosComputador;
     document.getElementById("pontos-empates").textContent = pontosEmpates;
 }

 function mostrarMao(lado, escolha) {
     let posicao = opcoes.indexOf(escolha);
     let figura = document.getElementById("icone-" + lado);
     let foto = document.getElementById("imagem-" + lado);

     figura.classList.remove("imagem-carregada");
     document.getElementById("emoji-" + lado).textContent = emojis[posicao];
     document.getElementById("texto-" + lado).textContent = nomeBonito(escolha);

     foto.onload = function () {
         figura.classList.add("imagem-carregada");
     };
     foto.onerror = function () {
         figura.classList.remove("imagem-carregada");
     };
     foto.src = imagens[posicao];

     if (foto.complete && foto.naturalWidth > 0) {
         figura.classList.add("imagem-carregada");
     }
 }

 function prepararImagens() {
     let fotos = document.querySelectorAll(".opcao-visual img");

     for (let i = 0; i < fotos.length; i++) {
         let foto = fotos[i];
         foto.onload = function () {
             foto.parentElement.classList.add("imagem-carregada");
         };
         foto.onerror = function () {
             foto.parentElement.classList.remove("imagem-carregada");
         };
         if (foto.complete && foto.naturalWidth > 0) {
             foto.parentElement.classList.add("imagem-carregada");
         }
     }
 }

 function bloquearBotoes(bloquear) {
     let botoes = document.querySelectorAll(".opcao");
     for (let i = 0; i < botoes.length; i++) {
         botoes[i].disabled = bloquear;
     }
     document.querySelector(".reiniciar").disabled = bloquear;
 }

 function resultadoTexto(texto, tipo) {
     document.getElementById("mensagem-resultado").textContent = texto;
     document.getElementById("resultado").className = "resultado " + tipo;
 }

 function jogar(jogador) {
     if (jogando) return;
     jogando = true;
     rodada++;
     document.getElementById("rodada").textContent = "RODADA " + String(rodada).padStart(2, "0");

     let numeroAleatorio = Math.floor(Math.random() * 3);
     let computador = opcoes[numeroAleatorio];

     bloquearBotoes(true);
     let botoes = document.querySelectorAll(".opcao");
     for (let i = 0; i < botoes.length; i++) {
         botoes[i].classList.remove("selecionada");
         if (botoes[i].getAttribute("data-escolha") === jogador) {
             botoes[i].classList.add("selecionada");
         }
     }

     mostrarMao("jogador", jogador);
     document.getElementById("icone-computador").classList.remove("imagem-carregada");
     document.getElementById("emoji-computador").textContent = "?";
     document.getElementById("texto-computador").textContent = "Pensando...";
     resultadoTexto("O computador está escolhendo...", "");

     setTimeout(function () {
         mostrarMao("computador", computador);

         let mensagem = "";
         let tipo = "";
         let explicacao = "";

         if (jogador === computador) {
             pontosEmpates++;
             mensagem = "Empate!";
             tipo = "empate";
             explicacao = "Os dois escolheram " + jogador + ".";
         } else {
             if ((jogador === "pedra" && computador === "tesoura") ||
                 (jogador === "papel" && computador === "pedra") ||
                 (jogador === "tesoura" && computador === "papel")) {
                 pontosJogador++;
                 mensagem = "Ponto seu!";
                 tipo = "vitoria";
             } else {
                 pontosComputador++;
                 mensagem = "Ponto da máquina!";
                 tipo = "derrota";
             }

             if ((jogador === "pedra" && computador === "tesoura") ||
                 (jogador === "tesoura" && computador === "pedra")) {
                 explicacao = "Pedra quebra tesoura.";
             } else if ((jogador === "papel" && computador === "pedra") ||
                        (jogador === "pedra" && computador === "papel")) {
                 explicacao = "Papel cobre pedra.";
             } else {
                 explicacao = "Tesoura corta papel.";
             }
         }

         resultadoTexto(mensagem + " " + explicacao, tipo);
         atualizarPlacar();
         bloquearBotoes(false);
         jogando = false;
     }, 550);
 }

 function reiniciar() {
     if (jogando) return;

     pontosJogador = 0;
     pontosComputador = 0;
     pontosEmpates = 0;
     rodada = 0;
     atualizarPlacar();
     document.getElementById("rodada").textContent = "RODADA 01";

     document.getElementById("icone-jogador").classList.remove("imagem-carregada");
     document.getElementById("icone-computador").classList.remove("imagem-carregada");
     document.getElementById("emoji-jogador").textContent = "?";
     document.getElementById("emoji-computador").textContent = "?";
     document.getElementById("texto-jogador").textContent = "Aguardando";
     document.getElementById("texto-computador").textContent = "Aguardando";
     resultadoTexto("Escolha uma jogada para começar.", "");

     let botoes = document.querySelectorAll(".opcao");
     for (let i = 0; i < botoes.length; i++) {
         botoes[i].classList.remove("selecionada");
     }
 }

 prepararImagens();
