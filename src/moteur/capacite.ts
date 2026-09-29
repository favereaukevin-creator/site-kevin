// Capacité d'emprunt pour un crédit immobilier, selon la méthode des banques.
//
// Règle du Haut Conseil de stabilité financière (décision D-HCSF-2021-7),
// maintenue à l'identique en 2026 :
//   • taux d'effort de 35 % au plus des revenus nets avant impôt, ASSURANCE
//     EMPRUNTEUR COMPRISE ;
//   • durée de 25 ans au plus (27 ans avec un différé, pour un achat dans le
//     neuf ou avec au moins 10 % de travaux) ;
//   • les banques peuvent déroger pour 20 % de leurs dossiers, en priorité
//     pour la résidence principale.
//
// Usage bancaire courant, repris ici : les loyers perçus ne sont retenus qu'à
// 70 %, pour couvrir vacance et charges.

export const TAUX_EFFORT_MAX = 0.35
export const DUREE_MAX_ANS = 25
export const DUREE_MAX_DIFFERE_ANS = 27
export const PART_LOYERS_RETENUE = 0.70

export interface CapaciteParams {
  /** Revenus nets mensuels du foyer, avant impôt (€/mois). */
  revenusMensuels: number
  /** Loyers perçus bruts (€/mois), retenus à 70 %. */
  loyersPercus: number
  /** Mensualités des crédits en cours, qui continueront après l'achat (€/mois). */
  chargesCredits: number
  tauxCredit: number     // décimal
  tauxAssurance: number  // décimal, annuel, sur le capital emprunté
  dureeAns: number
  apport: number
  fraisNotairePct: number // décimal, sur le prix du bien
}

export interface CapaciteResult {
  revenusRetenus: number
  mensualiteMax: number        // assurance comprise
  capital: number              // montant empruntable
  budget: number               // capital + apport
  prixMax: number              // budget, frais de notaire déduits
  tauxEffortActuel: number     // crédits en cours / revenus retenus
  resteAVivre: number          // revenus retenus − charges − nouvelle mensualité
  dureeAuDela: boolean         // durée saisie > 25 ans
}

/** Mensualité hors assurance d'un emprunt de 1 €. */
export function facteurAnnuite(tauxAnnuel: number, nMois: number): number {
  if (nMois <= 0) return 0
  const i = tauxAnnuel / 12
  return i === 0 ? 1 / nMois : i / (1 - Math.pow(1 + i, -nMois))
}

export function capaciteEmprunt(p: CapaciteParams): CapaciteResult {
  const revenusRetenus = Math.max(0, p.revenusMensuels) + Math.max(0, p.loyersPercus) * PART_LOYERS_RETENUE
  const charges = Math.max(0, p.chargesCredits)
  const mensualiteMax = Math.max(0, revenusRetenus * TAUX_EFFORT_MAX - charges)
  const nMois = Math.max(1, Math.round(p.dureeAns * 12))
  // Assurance calculée sur le capital initial : elle s'ajoute au facteur d'annuité.
  const parEuro = facteurAnnuite(p.tauxCredit, nMois) + p.tauxAssurance / 12
  const capital = parEuro > 0 ? mensualiteMax / parEuro : 0
  const budget = capital + Math.max(0, p.apport)
  return {
    revenusRetenus,
    mensualiteMax,
    capital,
    budget,
    prixMax: budget / (1 + Math.max(0, p.fraisNotairePct)),
    tauxEffortActuel: revenusRetenus > 0 ? charges / revenusRetenus : 0,
    resteAVivre: revenusRetenus - charges - mensualiteMax,
    dureeAuDela: p.dureeAns > DUREE_MAX_ANS,
  }
}
