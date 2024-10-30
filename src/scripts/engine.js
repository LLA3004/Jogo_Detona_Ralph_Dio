const estado = {
  view: {
    quadrados: document.querySelectorAll(".square"),
    inimigo: document.querySelector(".enemy"),
    tempoRestante: document.querySelector("#tempo-rest"),
    pontuacao: document.querySelector("#placar"),
    highScore: document.querySelector("#high-score"),
    vidas: document.querySelector(".menu-vidas h2:last-of-type"),
  },
  valores: {
    velocidadeJogo: 1500,
    posicaoAcerto: 0,
    posicaoAnterior: null,
    resultado: 0,
    tempoAtual: 60,
    vidas: 3,
    highScore: 0,
    clicouCorretamente: false,
    primeiraMovimentacao: true,
  },
  acoes: {
    idTimer: null,
    idContagemRegressiva: null,
  },
};

function contagemRegressiva() {
  estado.valores.tempoAtual--;
  estado.view.tempoRestante.textContent = estado.valores.tempoAtual;

  if (estado.valores.tempoAtual <= 0) {
    finalizarJogo("O tempo acabou! O seu resultado foi: ");
  }
}

function tocarSom(nomeAudio) {
  const audio = new Audio(`./src/audios/${nomeAudio}.m4a`);
  audio.volume = 0.2;
  audio.play().catch((error) => console.error("Erro ao reproduzir o áudio:", error));
}

function quadradoAleatorio() {
  estado.view.quadrados.forEach((quadrado) => {
    quadrado.classList.remove("enemy");
  });

  let numeroAleatorio;

  do {
    numeroAleatorio = Math.floor(Math.random() * 9);
  } while (numeroAleatorio === estado.valores.posicaoAnterior);

  const quadradoAleatorio = estado.view.quadrados[numeroAleatorio];
  quadradoAleatorio.classList.add("enemy");
  estado.valores.posicaoAcerto = quadradoAleatorio.id;
  estado.valores.posicaoAnterior = numeroAleatorio;

  if (!estado.valores.primeiraMovimentacao && !estado.valores.clicouCorretamente) {
    perderVida();
  }

  estado.valores.primeiraMovimentacao = false;
  estado.valores.clicouCorretamente = false;
}

function perderVida() {
  estado.valores.vidas--;
  estado.view.vidas.textContent = "x" + estado.valores.vidas;

  if (estado.valores.vidas <= 0) {
    finalizarJogo("Game Over! Você perdeu todas as vidas. O seu resultado foi: ");
  }
}

function adicionarOuvirCaixa() {
  estado.view.quadrados.forEach((quadrado) => {
    quadrado.addEventListener("mousedown", () => {
      if (estado.valores.vidas <= 0) {
        return;
      }

      if (quadrado.id === estado.valores.posicaoAcerto) {
        estado.valores.resultado++;
        estado.view.pontuacao.textContent = estado.valores.resultado;
        estado.valores.clicouCorretamente = true;
        tocarSom("src_audios_hit");

        if (estado.valores.resultado > estado.valores.highScore) {
          estado.valores.highScore = estado.valores.resultado;
          estado.view.highScore.textContent = estado.valores.highScore;
        }
      } else {
        perderVida();
      }
    });
  });
}

function finalizarJogo(mensagem) {
  clearInterval(estado.acoes.idContagemRegressiva);
  clearInterval(estado.acoes.idTimer);
  alert(mensagem + estado.valores.resultado);

  if (confirm("Deseja jogar novamente?")) {
    location.reload();
  }
}

function reiniciarJogo() {
  clearInterval(estado.acoes.idContagemRegressiva);
  clearInterval(estado.acoes.idTimer);

  estado.valores.tempoAtual = 60;
  estado.valores.vidas = 3;
  estado.valores.resultado = 0;
  estado.valores.posicaoAcerto = null;
  estado.valores.posicaoAnterior = null;
  estado.valores.clicouCorretamente = false;
  estado.valores.primeiraMovimentacao = true;

  estado.view.tempoRestante.textContent = estado.valores.tempoAtual;
  estado.view.pontuacao.textContent = estado.valores.resultado;
  estado.view.vidas.textContent = "x" + estado.valores.vidas;

  estado.acoes.idTimer = setInterval(quadradoAleatorio, estado.valores.velocidadeJogo);
  estado.acoes.idContagemRegressiva = setInterval(contagemRegressiva, 1000);
  quadradoAleatorio();
}

function mostrarMensagemInicio() {
  const iniciar = confirm("Bem-vindo! Clique em 'OK' para iniciar o jogo.");
  if (iniciar) {
    iniciarJogo();
  }
}

function iniciarJogo() {
  adicionarOuvirCaixa();
  reiniciarJogo();
}

// Mostra a mensagem inicial antes de começar o jogo
mostrarMensagemInicio();
