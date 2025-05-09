
function verificarResposta() {
  const resposta = document.getElementById('resposta').value.toLowerCase().trim();
  const respostaCriptografada = CryptoJS.MD5(resposta).toString();
  const corretaCriptografada = fases[faseAtual].respostaCorreta;
  const mensagem = document.getElementById('mensagem');

  if (respostaCriptografada === corretaCriptografada) {
    mensagem.style.color = "green";
    mensagem.innerText = "";
	mostrarLoading();
    desempenho[faseAtual] = true;
    atualizarProgresso();
    atualizarContador();

    const user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref(`progresso/${user.uid}`).set({
        desempenho: desempenho,
        faseAtual: faseAtual
      });
    }
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
