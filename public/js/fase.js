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
}

function atualizarProgresso() {
  const progresso = document.getElementById('progresso');
  const total = desempenho.length || 1;
  const concluidas = desempenho.filter(x => x === true).length;
  progresso.style.width = `${(concluidas / total) * 100}%`;
}

function atualizarContador() {
  const respostaInput = document.getElementById('resposta');
  const contador = document.getElementById('contadorCaracteres');
  const respostaCorreta = fases[faseAtual]?.respostaCorreta || "";

  const restantes = Math.max(0, respostaCorreta.length - respostaInput.value.length);

  contador.innerText = `Caracteres restantes: ${restantes}`;
}