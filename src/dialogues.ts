// Ouverture et fermeture des fenêtres de la page Ressources.

document.querySelectorAll<HTMLButtonElement>('[data-ouvre]').forEach(bouton => {
  const dialogue = document.getElementById(bouton.dataset.ouvre!) as HTMLDialogElement | null
  bouton.addEventListener('click', () => dialogue?.showModal())
})
document.querySelectorAll<HTMLDialogElement>('dialog').forEach(d => {
  d.querySelector('[data-ferme]')?.addEventListener('click', () => d.close())
  // Un clic sur le fond referme la fenêtre.
  d.addEventListener('click', e => { if (e.target === d) d.close() })
})
