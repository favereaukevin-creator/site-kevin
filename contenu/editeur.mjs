// Identité de l'éditeur. Un seul endroit : les mentions légales, le bloc de
// contact et le pied y puisent tous, donc ils ne peuvent pas diverger.
//
// Tant qu'une valeur reste entre chevrons, `construire-pages.mjs` refuse de
// construire le site en diffusion publique.
//
// SOURCES, relevées le 28/09/2026 :
//   • Attestation d'inscription ORIAS du 25/09/2026
//   • Registre ORIAS en ligne, fiche 920478518 — le numéro y est bien INSCRIT
//   • Courriel ANACOFI du 07/09/2026 — adhésion ANACOFI-COURTAGE, activité MIA
//   • Mandat de médiation ANACOFI-COURTAGE — membre institutionnel de LMA
//   • Kevin, le 28/09/2026 : micro-entrepreneur, non assujetti à la TVA
//
// Adresse, téléphone et courriel sont ceux que Kevin a déclarés PUBLICS sur le
// registre de l'ORIAS : les reprendre ici n'expose rien de plus.
//
// À renouveler : l'inscription ORIAS court jusqu'au 28/02/2027 et se
// renouvelle chaque année. Le numéro, lui, ne change pas.

export const ARENSEIGNER = {
  nom: 'Kevin Favereau',
  adresse: '14 chemin du Magnolia, 82700 Montech',
  telephone: '06 74 16 09 01',
  courriel: 'favereaukevin@gmail.com',
  statut: 'RCS Montauban 920 478 518',
  orias: '26009613',
  // Micro-entrepreneur en franchise en base : mention exacte du BOFiP
  // (BOI-TVA-DECLA-40-10-20). Les commissions d'intermédiation sont en outre
  // exonérées par nature (CGI art. 261 C, 1° a et 2°). Si le chiffre d'affaires
  // dépasse un jour le seuil de franchise, cette ligne devient fausse.
  tva: 'TVA non applicable, article 293 B du CGI',
  associationMia: "ANACOFI-COURTAGE, 92 rue d'Amsterdam, 75009 Paris",
  // Association de rattachement pour l'activité MIOBSP. Vide = non affichée :
  // l'immatriculation ORIAS suffit à l'obligation légale. À compléter si Kevin
  // la précise.
  associationIobsp: '',
  autorite: 'Autorité de contrôle prudentiel et de résolution (ACPR), 4 place de Budapest, CS 92459, 75436 Paris Cedex 09',
  mediateur: "La Médiation de l'Assurance, TSA 50110, 75441 Paris Cedex 09 — www.mediation-assurance.org",
}
