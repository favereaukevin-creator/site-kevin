// Gain fiscal d'un versement sur un Plan d'épargne retraite (PER individuel).
// Règles vérifiées le 28/09/2026 sur le BOFiP et service-public.gouv.fr, et
// partagées avec le site Lignée.
//
// Ce que fait ce calcul : il plafonne le versement déductible, puis chiffre
// l'économie d'impôt au taux marginal d'imposition (TMI) choisi.
//
// Ce qu'il ne fait pas, et que l'écran doit dire :
//   • si la déduction fait changer de tranche, l'économie réelle est un peu
//     inférieure au calcul « versement × TMI » ;
//   • le plafond calculé est celui d'un salarié (10 % des revenus d'activité
//     nets de frais professionnels). Un indépendant dispose d'un plafond
//     plus large : il faut alors saisir celui de son avis d'impôt ;
//   • les plafonds non utilisés des cinq années précédentes s'ajoutent : ils
//     figurent sur l'avis d'impôt, que l'on peut saisir directement ;
//   • à la sortie, le capital correspondant aux versements déduits est imposé.

export const PER_TAUX_DEDUCTION = 0.10
/** 10 % du plafond annuel de la Sécurité sociale 2025 (47 100 €). */
export const PER_PLAFOND_MIN_2026 = 4_710
/** 10 % de huit fois ce même plafond. */
export const PER_PLAFOND_MAX_2026 = 37_680
/** Depuis le 1er janvier 2026, les versements faits à partir de 70 ans ne sont plus déductibles. */
export const PER_AGE_FIN_DEDUCTION = 70

export const TRANCHES = [0, 0.11, 0.30, 0.41, 0.45] as const

export interface PerParams {
  /** Revenus d'activité nets de frais professionnels de l'année précédente (€/an). */
  revenusActivite: number
  /** Taux marginal d'imposition, en décimal (0,30 pour 30 %). */
  tmi: number
  /** Versement annuel envisagé (€). */
  versementAnnuel: number
  /** Plafond figurant sur l'avis d'impôt, reports compris. null = calculé. */
  plafondAvis: number | null
  age: number
  /** Nombre d'années de versement jusqu'au départ en retraite. */
  anneesAvantRetraite: number
  /** Rendement annuel net de frais du contrat, en décimal. */
  rendement: number
}

export interface PerResult {
  plafondCalcule: number
  plafondRetenu: number
  versementDeductible: number
  depassement: number
  economieAnnuelle: number
  /** Ce que le versement coûte vraiment, une fois l'impôt économisé. */
  effortReelAnnuel: number
  effortReelMensuel: number
  deductible: boolean
  capitalRetraite: number
  totalVerse: number
  totalEconomies: number
}

export function plafondSalarie(revenusActivite: number): number {
  const dixPourCent = Math.max(revenusActivite, 0) * PER_TAUX_DEDUCTION
  return Math.min(Math.max(dixPourCent, PER_PLAFOND_MIN_2026), PER_PLAFOND_MAX_2026)
}

export function simulePer(p: PerParams): PerResult {
  const versement = Math.max(p.versementAnnuel, 0)
  const deductible = p.age < PER_AGE_FIN_DEDUCTION
  const plafondCalcule = plafondSalarie(p.revenusActivite)
  const plafondRetenu = p.plafondAvis != null && p.plafondAvis > 0 ? p.plafondAvis : plafondCalcule
  const versementDeductible = deductible ? Math.min(versement, plafondRetenu) : 0
  const economieAnnuelle = versementDeductible * p.tmi
  const effortReelAnnuel = versement - economieAnnuelle

  // Versements en milieu d'année en moyenne : une demi-année de rendement.
  const n = Math.max(0, Math.round(p.anneesAvantRetraite))
  let capital = 0
  for (let a = 0; a < n; a++) capital = capital * (1 + p.rendement) + versement * (1 + p.rendement / 2)

  return {
    plafondCalcule,
    plafondRetenu,
    versementDeductible,
    depassement: deductible ? Math.max(0, versement - plafondRetenu) : versement,
    economieAnnuelle,
    effortReelAnnuel,
    effortReelMensuel: effortReelAnnuel / 12,
    deductible,
    capitalRetraite: capital,
    totalVerse: versement * n,
    totalEconomies: economieAnnuelle * n,
  }
}
