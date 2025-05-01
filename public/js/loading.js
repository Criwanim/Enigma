const frasesLoading = [
  "Aquecendo motores...",
  "Acendendo lareira...",
  "Carregando propulsores...",
  "Preparando desafio...",
  "Decifrando enigmas...",
  "Afiando lápis mentais...",
  "Desvendando mistérios...",
  "Ajustando engrenagens...",
  "Polindo charadas...",
  "Recarregando sinapses...",
  "Conectando neurônios...",
  "Organizando pistas..."
];

let intervaloFrasesLoading;

function mostrarLoading() {
  const overlay = document.getElementById("loadingOverlay");
  const texto = document.getElementById("loadingText");
  texto.innerText = frasesLoading[Math.floor(Math.random() * frasesLoading.length)];
  overlay.style.display = "flex";
  document.getElementById("gameScreen").classList.add("oculto-por-loading");

  let frasesAleatorias = [...frasesLoading].sort(() => Math.random() - 0.5);
  let i = 0;
  texto.innerText = frasesAleatorias[i % frasesAleatorias.length];
  intervaloFrasesLoading = setInterval(() => {
  i++;
  texto.innerText = frasesAleatorias[i % frasesAleatorias.length];
  }, 1500);
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