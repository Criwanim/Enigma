
function verificarResposta() {
  const resposta = document.getElementById('resposta').value.toLowerCase().trim();
  const correta = fases[faseAtual].respostaCorreta.toLowerCase();
  const mensagem = document.getElementById('mensagem');

  if (resposta === correta) {
    mensagem.style.color = "green";
    mensagem.innerText = "";
	mostrarLoading();
    desempenho[faseAtual] = true;
    atualizarProgresso();
    atualizarContador();

    setTimeout(() => {
      if (faseAtual < fases.length - 1) {
        faseAtual++;
        carregarFase();
		setTimeout(() => {
			esconderLoading();
		}, 750);
      } else {
	  setTimeout(() => {
		esconderLoading();
		document.getElementById('gameScreen').style.display = 'none';
		document.getElementById('parabensScreen').style.display = 'flex';
		if (typeof startFireworks === "function") startFireworks();
		}, 750);
      }
    }, 500);

  } else {
    mensagem.style.color = "red";
    mensagem.innerText = "Resposta incorreta. Tente novamente.";
    desempenho[faseAtual] = false;
  }
}

function ativarSomFogos() {
  const sound = new Audio('https://www.soundjay.com/explosion/explosion-01.mp3');
  sound.play();
}

function reiniciarJogo() {
  document.getElementById('parabensScreen').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  fases = [];
  faseAtual = 0;
  desempenho = [];
}
