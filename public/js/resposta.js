function verificarResposta() {
  const resposta = document.getElementById('resposta').value.toLowerCase().trim();
  const respostaCriptografada = CryptoJS.MD5(resposta).toString();
  const corretaCriptografada = fases[faseAtual].respostaCorreta;
  const mensagem = document.getElementById('mensagem');
  const contador = document.getElementById('contadorCaracteres');
  const tamanhoEsperado = fases[faseAtual]?.tamanhoResposta || 0;
  
  if (resposta.length < tamanhoEsperado) {
	aplicarEfeitoContador(contador);
	return;
  }
  mensagem.classList.remove("oculta");

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
    let feedback = "Resposta incorreta. Tente novamente.";
    const dicaTexto = fases[faseAtual]?.dicasIncorretas || "";
    const respostaNormalizada = resposta.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove acentos

    const dicasArray = dicaTexto.split(";").map(s => s.trim());
    for (const dica of dicasArray) {
      if (dica.includes("--")) {
        const [palavrasStr, comentario] = dica.split("--").map(s => s.trim().toLowerCase());
        const palavras = palavrasStr.split(":").map(s =>
          s.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        );

        if (palavras.includes(respostaNormalizada)) {
          feedback = comentario;
          break;
        }
      }
    }

    mensagem.style.color = "red";
    mensagem.innerText = feedback;
    desempenho[faseAtual] = false;

    // Esconde após 5 segundos com suavidade
    setTimeout(() => {
      mensagem.classList.add("oculta");
    }, 5000);
  }
}

function aplicarEfeitoContador(contador) {
  clearTimeout(temporizadorContador);
  contador.classList.add("contador-excedido");
  contador.classList.remove("contador-normal");

  // Reinicia a animação
  contador.style.animation = "none";
  void contador.offsetWidth;
  contador.style.animation = null;

  // Após 5 segundos, volta ao normal
  temporizadorContador = setTimeout(() => {
    contador.classList.remove("contador-excedido");
    contador.classList.add("contador-normal");
  }, 5000);
}