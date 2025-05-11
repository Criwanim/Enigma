let fases = [];
let faseAtual = 0;
let desempenho = [];

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

function carregarFasesEDepois(callback) {
  mostrarLoading();
  const user = firebase.auth().currentUser;

  // Fase 0 tutorial fixa
  fases = [{
    titulo: "... espalha rama pelo chão.",
    imagem: "img/tutorial.gif", 
    descricao: "... quando dorme poe a mão no ______.",
    respostaCorreta: CryptoJS.MD5("coracao").toString(),
    tamanhoResposta: 7
  }];

  firebase.database().ref('desafios').once('value')
    .then(snapshot => {
      const desafiosData = snapshot.val();

      const fasesFirebase = Object.entries(desafiosData).map(([_, desafio]) => ({
        titulo: desafio.texto01,
        imagem: desafio.imagem01,
        descricao: desafio.texto02,
        respostaCorreta: desafio.resposta,
        tamanhoResposta: parseInt(desafio.QtdeCaracteresResposta)
      }));

      // Adiciona as fases do Firebase após a Fase 0
      fases = [...fases, ...fasesFirebase];

      // Carrega progresso se o usuário estiver logado
      if (user) {
        return firebase.database().ref(`progresso/${user.uid}`).once('value');
      }

      return null;
    })
    .then(snapshot => {
      if (snapshot && snapshot.exists()) {
        const dados = snapshot.val();
        desempenho = Array.isArray(dados.desempenho) ? dados.desempenho : Array(fases.length).fill(null);
        faseAtual = typeof dados.faseAtual === 'number' ? dados.faseAtual : 0;
      } else {
        desempenho = Array(fases.length).fill(null);
        faseAtual = 0;
      }
    })
    .catch(error => {
      alert("Erro ao carregar dados do Firebase: " + error.message);

      // Se falhar, continua só com a fase 0
      desempenho = Array(fases.length).fill(null);
      faseAtual = 0;
    })
    .finally(() => {
      setTimeout(esconderLoading, 2000);
      if (callback) callback();
    });
}
