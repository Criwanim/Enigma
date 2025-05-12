function carregarFase() {
  const fase = fases[faseAtual];

  document.getElementById('titulo').innerText = fase.titulo;
  document.getElementById('imagem').style.display = fase.imagem ? 'block' : 'none';
  document.getElementById('imagem').src = fase.imagem || '';
  document.getElementById('descricao').innerText = fase.descricao;
  document.getElementById('resposta').value = '';
  document.getElementById('mensagem').innerText = '';
  document.getElementById('marcadorFase').innerText = `Fase ${faseAtual + 1} de ${fases.length}`;

  atualizarProgresso();
  atualizarContador();
  renderizarNavegacaoFases();
}

function atualizarProgresso() {
  const progresso = document.getElementById('progresso');
  const total = desempenho.length || 1;
  const concluidas = desempenho.filter(x => x === true).length;
  progresso.style.width = `${(concluidas / total) * 100}%`;
}

let temporizadorContador = null;

function atualizarContador() {
  const respostaInput = document.getElementById('resposta');
  const contador = document.getElementById('contadorCaracteres');
  const tamanhoEsperado = fases[faseAtual]?.tamanhoResposta || 0;

  const atual = respostaInput.value.length;
  const restantes = Math.max(0, tamanhoEsperado - atual);

  contador.innerText = `Caracteres restantes: ${restantes}`;

  if (atual > tamanhoEsperado) {
    aplicarEfeitoContador(contador);
  } else {
    contador.classList.remove("contador-excedido");
    contador.classList.add("contador-normal");
  }
}

function renderizarNavegacaoFases() {
  const container = document.getElementById("navegacaoFases");
  container.innerHTML = "";

  const primeiraNaoRespondida = desempenho.findIndex(x => x !== true);

  fases.forEach((_, index) => {
    const botao = document.createElement("button");
    botao.className = "botao-fase";
    botao.innerText = index + 1;

    const atual = index === faseAtual;
    const desbloqueado = desempenho[index] === true || index === primeiraNaoRespondida;

    if (atual) {
      botao.classList.add("ativa");
    }

    botao.disabled = !desbloqueado;

    botao.onclick = () => {
      faseAtual = index;
      carregarFase();
      renderizarNavegacaoFases();
    };

    container.appendChild(botao);
  });
}

