// Moteur SCPI « Versement initial + versements programmés » — transcription de
// Simulation_SCPI_VI + VP 2026.xlsx (capitalisation linéaire, revenus non réinvestis).
// Les droits d'entrée sont prélevés en amont sur chaque versement.
//
// Écarts assumés par rapport au fichier d'origine :
//
//   1. La durée totale de simulation est réellement appliquée (elle était ignorée)
//      et la colonne dupliquée F/G est supprimée.
//   2. Les revenus ne sont plus additionnés au capital. L'Excel affichait un
//      « capital » = versements + revenus cumulés tout en présentant ces mêmes
//      revenus comme distribués au client : ils étaient comptés deux fois.
//      → capitalInvesti et revenusCumulesNets sont deux grandeurs distinctes.
//   3. Le total versé est désormais exposé brut (ce qui sort de la poche du
//      client) ET net de droits d'entrée (ce qui est réellement investi).
//      L'Excel n'exposait que le net sous le libellé « total versé ».
//   4. Les versements de l'année en cours ne rapportent qu'un demi-exercice :
//      l'Excel appliquait le rendement plein à des VP étalés sur 12 mois.
//   5. Un frottement fiscal optionnel s'applique aux revenus distribués.
//      À 0 %, les revenus affichés sont bruts — l'écran doit le dire.
//   6. Une colonne de comparaison chiffre le capital que le client aurait s'il
//      réinvestissait ses dividendes au lieu de les percevoir. Ce scénario est
//      calculé en parallèle et ne modifie pas la projection principale.
//
// Hypothèses : rendement constant, aucune revalorisation ni dépréciation du prix
// de part, revenus distribués et non réinvestis, aucune vacance ni frais de
// gestion au-delà des droits d'entrée.
// Scénario réinvesti : seul le dividende NET de frottement fiscal peut être
// réinvesti (on ne réinvestit que ce qu'on encaisse), il subit les mêmes droits
// d'entrée que les autres versements, et il est réinvesti en fin d'exercice donc
// ne produit de revenu qu'à partir de l'année suivante.

export interface ScpiViVpParams {
  tauxRendement: number    // Rendement annuel (%)
  versementInitial: number // Versement initial (€)
  vpMensuel: number        // Versement programmé mensuel (€)
  dureeVp: number          // Durée des versements programmés (années)
  dureeTotale: number      // Durée totale de la simulation (années)
  droitsEntree: number     // Droits d'entrée (%)
  frottementFiscal: number // Frottement fiscal sur les revenus distribués (%)
}

export interface ScpiViVpRow {
  annee: number
  versementBrutAnnee: number    // sorti de poche dans l'année (€)
  versementNetAnnee: number     // réellement investi dans l'année, net de droits (€)
  cumulVerseBrut: number        // total sorti de poche depuis le départ (€)
  capitalInvesti: number        // capital investi cumulé, net de droits (€)
  revenuAnnuelBrut: number      // rendement × capital investi (€)
  revenuAnnuelNet: number       // net du frottement fiscal (€)
  revenuMensuelNet: number
  revenusCumulesNets: number    // revenus perçus depuis le départ — PAS du capital (€)
  capitalReinvesti: number      // capital du scénario « dividendes réinvestis » (€)
  revenuAnnuelReinvesti: number // revenu net de ce scénario dans l'année (€)
}

export interface ScpiViVpResult {
  rows: ScpiViVpRow[]
  capitalInvestiFinal: number
  totalVerseBrut: number
  totalDroitsEntree: number
  totalRevenusNets: number
  revenuMensuelBrutFinal: number
  revenuMensuelNetFinal: number
  /** Capital au terme si les dividendes nets avaient été réinvestis. */
  capitalReinvestiFinal: number
  /** Écart entre le scénario réinvesti et le capital réellement investi. */
  gainReinvestissement: number
  /** Revenu mensuel au terme dans le scénario réinvesti. */
  revenuMensuelReinvestiFinal: number
  /** Années de VP demandées mais hors simulation (dureeVp > dureeTotale). */
  anneesVpIgnorees: number
  /** Montant des versements programmés jamais simulés, à signaler à l'écran. */
  versementsIgnores: number
}

export function simulate(p: ScpiViVpParams): ScpiViVpResult {
  const net = (100 - p.droitsEntree) / 100
  const vpAnnuelBrut = p.vpMensuel * 12
  const vpAnnuelNet = vpAnnuelBrut * net
  const viNet = p.versementInitial * net
  const rend = p.tauxRendement / 100
  const netFiscal = 1 - p.frottementFiscal / 100
  const nYears = Math.max(1, Math.round(p.dureeTotale))
  const dureeVp = Math.max(0, Math.round(p.dureeVp))

  const rows: ScpiViVpRow[] = []
  let capitalInvesti = 0
  let cumulVerseBrut = 0
  let revenusCumulesNets = 0
  let capitalReinvesti = 0

  for (let annee = 1; annee <= nYears; annee++) {
    const enPhaseVp = annee <= dureeVp
    const versementBrutAnnee = (annee === 1 ? p.versementInitial : 0) + (enPhaseVp ? vpAnnuelBrut : 0)
    const versementNetAnnee = (annee === 1 ? viNet : 0) + (enPhaseVp ? vpAnnuelNet : 0)

    // Écart 4 : le versement initial travaille toute l'année, les VP en moyenne
    // une demi-année. Le capital des années précédentes travaille en plein.
    const vpNetAnnee = enPhaseVp ? vpAnnuelNet : 0
    const apportAnnee = (annee === 1 ? viNet : 0) + vpNetAnnee / 2
    const baseRendement = capitalInvesti + apportAnnee

    capitalInvesti += versementNetAnnee
    cumulVerseBrut += versementBrutAnnee

    const revenuAnnuelBrut = baseRendement * rend
    const revenuAnnuelNet = revenuAnnuelBrut * netFiscal
    revenusCumulesNets += revenuAnnuelNet

    // Scénario parallèle : le dividende net est réinvesti en fin d'exercice,
    // droits d'entrée déduits, et ne produit donc de revenu qu'à partir de l'an suivant.
    const revenuAnnuelReinvesti = (capitalReinvesti + apportAnnee) * rend * netFiscal
    capitalReinvesti += versementNetAnnee + revenuAnnuelReinvesti * net

    rows.push({
      annee,
      versementBrutAnnee,
      versementNetAnnee,
      cumulVerseBrut,
      capitalInvesti,
      revenuAnnuelBrut,
      revenuAnnuelNet,
      revenuMensuelNet: revenuAnnuelNet / 12,
      revenusCumulesNets,
      capitalReinvesti,
      revenuAnnuelReinvesti,
    })
  }

  const last = rows[rows.length - 1]
  const anneesVpIgnorees = Math.max(0, dureeVp - nYears)
  return {
    rows,
    capitalInvestiFinal: last.capitalInvesti,
    totalVerseBrut: last.cumulVerseBrut,
    totalDroitsEntree: last.cumulVerseBrut - last.capitalInvesti,
    totalRevenusNets: last.revenusCumulesNets,
    revenuMensuelBrutFinal: last.revenuAnnuelBrut / 12,
    revenuMensuelNetFinal: last.revenuMensuelNet,
    capitalReinvestiFinal: last.capitalReinvesti,
    gainReinvestissement: last.capitalReinvesti - last.capitalInvesti,
    revenuMensuelReinvestiFinal: last.revenuAnnuelReinvesti / 12,
    anneesVpIgnorees,
    versementsIgnores: anneesVpIgnorees * vpAnnuelBrut,
  }
}
