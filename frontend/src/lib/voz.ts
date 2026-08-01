// Lectura en voz alta, en español. En la app móvil usa expo-speech (offline);
// aquí usamos la Web Speech API del navegador.
export function hablar(texto: string): void {
  if (!texto || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'es-ES';
  utterance.pitch = 1.05;
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

export function detenerVoz(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
