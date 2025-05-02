function loginFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(() => {
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("gameScreen").style.display = "flex";
      carregarFasesEDepois(carregarFase);
    })
    .catch(error => alert("Erro no login com Facebook: " + error.message));
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
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "flex";
  carregarFasesEDepois(carregarFase);
}
