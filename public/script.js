const firebaseConfig = {
  apiKey: "AIzaSyBfDQB_VCbGKwGGCkpgmONyIA0FpArcTb4",
  authDomain: "enigma-a7af6.firebaseapp.com",
  databaseURL: "https://enigma-a7af6.firebaseio.com",
  projectId: "enigma-a7af6",
  storageBucket: "enigma-a7af6.appspot.com",
  messagingSenderId: "401368607574",
  appId: "1:401368607574:web:363e73d681329d7dc344f7"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let fases = [];
let desempenho = [];
let faseAtual = 0;

const frasesLoading = [
  "Aquecendo motores...",
  "Acendendo lareira...",
  "Carregando propulsores...",
  "Preparando desafio...",
  "Decifrando enigmas...",
  "Organizando pistas..."
];

let intervaloFrasesLoading;

function mostrarLoading() {
  const overlay = document.getElementById("loadingOverlay");
  const texto = document.getElementById("loadingText");
  texto.innerText = frasesLoading[Math.floor(Math.random() * frasesLoading.length)];
  overlay.style.display = "flex";
  document.getElementById("gameScreen").classList.add("oculto-por-loading");

  let i = 0;
  texto.innerText = frasesLoading[i % frasesLoading.length];
  intervaloFrasesLoading = setInterval(() => {
    i++;
    texto.innerText = frasesLoading[i % frasesLoading.length];
  }, 2000);
}

function esconderLoading() {
  clearInterval(intervaloFrasesLoading);
  document.getElementById("loadingOverlay").style.display = "none";
  document.getElementById("gameScreen").classList.remove("oculto-por-loading");
}

function mostrarFaseLoading() {
  document.getElementById("faseLoadingOverlay").style.display = "flex";
}

function esconderFaseLoading() {
  document.getElementById("faseLoadingOverlay").style.display = "none";
}

function carregarFasesEDepois(callback) {
  mostrarLoading();
  firebase.database().ref('desafios').once('value')
    .then((snapshot) => {
      const desafiosData = snapshot.val();
      fases = Object.entries(desafiosData).map(([_, desafio]) => ({
        titulo: desafio.texto01,
        imagem: desafio.imagem01,
        descricao: desafio.texto02,
        respostaCorreta: desafio.resposta
      }));

      faseAtual = 0;
      desempenho = Array(fases.length).fill(null);

      if (callback) callback();
    })
    .catch(error => {
      alert("Erro ao carregar dados do Firebase: " + error.message);
    })
    .finally(() => setTimeout(esconderLoading, 2000));
}

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

function verificarResposta() {
  const resposta = document.getElementById('resposta').value.toLowerCase().trim();
  const correta = fases[faseAtual].respostaCorreta.toLowerCase();
  const mensagem = document.getElementById('mensagem');

  if (resposta === correta) {
    mensagem.style.color = "green";
    mensagem.innerText = "Correto! Carregando próxima fase...";
    desempenho[faseAtual] = true;
    atualizarProgresso();
  atualizarContador();
    mostrarFaseLoading();

    setTimeout(() => {
      if (faseAtual < fases.length - 1) {
        faseAtual++;
        carregarFase();
        setTimeout(() => {
          esconderFaseLoading();
        }, 2000);
      } else {
        esconderFaseLoading();
        mensagem.innerText = "Parabéns! Você concluiu todas as fases!";
      }
    }, 2000);

  } else {
    mensagem.style.color = "red";
    mensagem.innerText = "Resposta incorreta. Tente novamente.";
    desempenho[faseAtual] = false;
  }
}

function atualizarProgresso() {
  const progresso = document.getElementById('progresso');
  const total = desempenho.length || 1;
  const concluidas = desempenho.filter(x => x === true).length;
  progresso.style.width = `${(concluidas / total) * 100}%`;
}

function loginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(() => {
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("gameScreen").style.display = "flex";
      carregarFasesEDepois(carregarFase);
    })
    .catch(error => alert("Erro no login: " + error.message));
}

function loginAnonimo() {
  firebase.auth().signOut().catch(() => {});
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "flex";
  carregarFasesEDepois(carregarFase);
}

function atualizarContador() {
  const respostaInput = document.getElementById('resposta');
  const contador = document.getElementById('contadorCaracteres');
  const respostaCorreta = fases[faseAtual]?.respostaCorreta || "";

  const restantes = Math.max(0, respostaCorreta.length - respostaInput.value.length);

  contador.innerText = `Caracteres restantes: ${restantes}`;
}
