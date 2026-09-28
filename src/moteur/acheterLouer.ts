// Acheter sa résidence principale ou rester locataire ?
//
// La comparaison honnête ne porte pas sur « mensualité contre loyer » mais sur
// le PATRIMOINE des deux ménages au fil des années, à budget égal :
//
//   • le propriétaire paie mensualité et charges, et se constitue la valeur du
//     bien diminuée du capital restant dû ;
//   • le locataire garde son apport — frais de notaire compris — et le place ;
//     chaque mois, il place aussi l'écart entre ce que coûterait l'achat et son
//     loyer. Si c'est le loyer qui coûte le plus, c'est le propriétaire qui place
//     la différence.
//
// L'achat « devient gagnant » l'année où le patrimoine du propriétaire dépasse
// celui du locataire.
//
// Hypothèses, à afficher : taux, rendement et revalorisations constants ;
// rendement du placement brut de fiscalité ; aucuns frais de revente ; la
// plus-value sur la résidence principale est exonérée d'impôt.

export interface AcheterLouerParams {
  prix: number
  fraisNotairePct: number       // décimal
  apport: number
  tauxCredit: number            // décimal
  dureeAns: number
  tauxAssurance: number         // décimal, sur le capital emprunté
  taxeFonciere: number          // €/an
  chargesCoproMens: number      // €/mois, part non récupérable
  entretienPct: number          // décimal du prix, provision annuelle
  revalorisationBienPct: number // décimal, annuel
  loyer: number                 // €/mois, charges locatives comprises
  revalorisationLoyerPct: number // décimal, annuel ; s'applique aussi aux charges
  rendementPlacementPct: number // décimal, annuel
  horizonAns: number
}

export interface AcheterLouerAnnee {
  annee: number
  coutProprietaireMens: number
  loyerMens: number
  valeurBien: number
  capitalRestantDu: number
  patrimoineProprietaire: number
  patrimoineLocataire: number
  ecart: number // propriétaire − locataire
}

export interface AcheterLouerResult {
  montantEmprunte: number
  mensualite: number            // assurance comprise
  fraisNotaire: number
  coutProprietaireMens1: number
  annees: AcheterLouerAnnee[]
  /** Première année où l'achat l'emporte, null s'il ne l'emporte pas sur l'horizon. */
  anneeBascule: number | null
  ecartFinal: number
}

export function pmt(tauxMensuel: number, nMois: number, capital: number): number {
  if (capital <= 0 || nMois <= 0) return 0
  if (tauxMensuel === 0) return capital / nMois
  return (capital * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -nMois))
}

export function simuleAcheterLouer(p: AcheterLouerParams): AcheterLouerResult {
  const fraisNotaire = p.prix * p.fraisNotairePct
  const montantEmprunte = Math.max(0, p.prix + fraisNotaire - p.apport)
  const nMois = Math.max(1, Math.round(p.dureeAns)) * 12
  const tauxMensuel = p.tauxCredit / 12
  const mensualiteHorsAssurance = pmt(tauxMensuel, nMois, montantEmprunte)
  const mensualite = mensualiteHorsAssurance + (montantEmprunte * p.tauxAssurance) / 12
  const rMensuel = Math.pow(1 + p.rendementPlacementPct, 1 / 12) - 1

  // Le locataire place d'emblée tout ce que l'acheteur a sorti de sa poche.
  let placementLocataire = p.apport
  let placementProprietaire = 0
  let crd = montantEmprunte
  const annees: AcheterLouerAnnee[] = []
  let anneeBascule: number | null = null

  const horizon = Math.max(1, Math.round(p.horizonAns))
  for (let annee = 1; annee <= horizon; annee++) {
    const index = Math.pow(1 + p.revalorisationLoyerPct, annee - 1)
    const loyerMens = p.loyer * index
    const chargesMens = index * (p.taxeFonciere / 12 + p.chargesCoproMens + (p.prix * p.entretienPct) / 12)
    let coutProprietaireAnnee = 0

    for (let m = 0; m < 12; m++) {
      const moisGlobal = (annee - 1) * 12 + m
      let credit = 0
      if (moisGlobal < nMois && crd > 0) {
        const interets = crd * tauxMensuel
        crd = Math.max(0, crd - (mensualiteHorsAssurance - interets))
        credit = mensualite
      }
      const coutProprietaire = credit + chargesMens
      coutProprietaireAnnee += coutProprietaire
      const ecartMois = coutProprietaire - loyerMens
      placementLocataire = placementLocataire * (1 + rMensuel) + Math.max(ecartMois, 0)
      placementProprietaire = placementProprietaire * (1 + rMensuel) + Math.max(-ecartMois, 0)
    }

    const valeurBien = p.prix * Math.pow(1 + p.revalorisationBienPct, annee)
    const patrimoineProprietaire = valeurBien - crd + placementProprietaire
    const ecart = patrimoineProprietaire - placementLocataire
    if (anneeBascule === null && ecart >= 0) anneeBascule = annee
    annees.push({
      annee,
      coutProprietaireMens: coutProprietaireAnnee / 12,
      loyerMens,
      valeurBien,
      capitalRestantDu: crd,
      patrimoineProprietaire,
      patrimoineLocataire: placementLocataire,
      ecart,
    })
  }

  return {
    montantEmprunte,
    mensualite,
    fraisNotaire,
    coutProprietaireMens1: annees[0].coutProprietaireMens,
    annees,
    anneeBascule,
    ecartFinal: annees[annees.length - 1].ecart,
  }
}
