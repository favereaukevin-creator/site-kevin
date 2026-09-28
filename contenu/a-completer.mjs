// Ce que seul Kevin peut fournir. Tant qu'un champ est vide, la préversion
// affiche un encadré « à compléter » à sa place ; en diffusion publique, la
// construction refuse de partir si le parcours manque (les listes vides, elles,
// font simplement disparaître leur rubrique).

export const A_COMPLETER = {
  /** Trois paragraphes sur ton parcours, à la première personne. */
  parcours: [],
  /** Chemin d'une photo déposée dans public/ (ex. '/portrait.jpg'), ou null. */
  photo: null,
  /** Diplômes et certifications : { titre, detail }. */
  diplomes: [],
  /** Partenaires (assureurs, sociétés de gestion, banques) : noms. */
  partenaires: [],
}
