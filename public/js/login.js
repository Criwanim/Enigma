
function loginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const userId = result.user.uid;

      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("gameScreen").style.display = "flex";

      carregarFasesEDepois(() => {
        // Espera carregar as fases para depois tentar restaurar faseAtual
        database.ref(`progresso/${userId}`).once('value')
          .then((snapshot) => {
            const salvo = snapshot.val();
            faseAtual = salvo?.faseAtual || 0;
          })
          .finally(() => {
            carregarFase();
          });
      });
    })
    .catch(error => alert("Erro no login: " + error.message));
}

function loginAnonimo() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "flex";
  carregarFasesEDepois(carregarFase);
}
