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

  firebase.database().ref('desafios').once('value')
    .then(snapshot => {
      const desafiosData = snapshot.val();
      fases = Object.entries(desafiosData).map(([_, desafio]) => ({
        titulo: desafio.texto01,
        imagem: desafio.imagem01,
        descricao: desafio.texto02,
        respostaCorreta: desafio.resposta,
        tamanhoResposta: parseInt(desafio.QtdeCaracteresResposta)
      }));

      // Agora, se o usuário estiver logado, carregamos o progresso DEPOIS das fases
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
      desempenho = Array(fases.length).fill(null);
      faseAtual = 0;
    })
    .finally(() => {
      setTimeout(esconderLoading, 2000);
      if (callback) callback();
    });
}