import { describe, it, expect } from 'vitest'
import { simulate, type ScpiViVpParams } from './scpi'

const DEFAULTS: ScpiViVpParams = {
  tauxRendement: 5,
  versementInitial: 10000,
  vpMensuel: 750,
  dureeVp: 25,
  dureeTotale: 40,
  droitsEntree: 4.8,
  frottementFiscal: 0,
}

describe('scpiViVp — séparation capital / revenus', () => {
  const r = simulate(DEFAULTS)

  it('n\'inclut jamais les revenus dans le capital investi', () => {
    for (const row of r.rows) {
      expect(row.capitalInvesti).toBeCloseTo(row.cumulVerseBrut * (1 - 4.8 / 100), 6)
    }
    expect(r.capitalInvestiFinal).toBeLessThan(r.totalVerseBrut)
  })

  it('expose le brut sorti de poche et les droits d\'entrée séparément', () => {
    // 10 000 € + 750 €/mois pendant 25 ans
    expect(r.totalVerseBrut).toBe(10000 + 750 * 12 * 25)
    expect(r.totalDroitsEntree).toBeCloseTo(r.totalVerseBrut * 0.048, 6)
    expect(r.capitalInvestiFinal).toBeCloseTo(r.totalVerseBrut - r.totalDroitsEntree, 6)
  })

  it('gèle le capital une fois les versements terminés', () => {
    const apresVp = r.rows.slice(25)
    for (const row of apresVp) {
      expect(row.versementBrutAnnee).toBe(0)
      expect(row.capitalInvesti).toBeCloseTo(r.capitalInvestiFinal, 6)
    }
  })

  it('fait croître les revenus cumulés de façon strictement monotone', () => {
    for (let i = 1; i < r.rows.length; i++) {
      expect(r.rows[i].revenusCumulesNets).toBeGreaterThan(r.rows[i - 1].revenusCumulesNets)
    }
  })
})

describe('scpiViVp — demi-exercice sur les versements de l\'année', () => {
  it('ne rapporte qu\'un demi-exercice sur les VP de l\'année en cours', () => {
    const r = simulate(DEFAULTS)
    const viNet = 10000 * 0.952
    const vpNet = 750 * 12 * 0.952
    // An 1 : le versement initial travaille en plein, les VP à moitié.
    expect(r.rows[0].revenuAnnuelBrut).toBeCloseTo((viNet + vpNet / 2) * 0.05, 6)
    // An 2 : tout le capital de fin d'an 1 en plein, plus la moitié des VP de l'an 2.
    expect(r.rows[1].revenuAnnuelBrut).toBeCloseTo((viNet + vpNet + vpNet / 2) * 0.05, 6)
  })

  it('applique le rendement plein une fois les versements arrêtés', () => {
    const r = simulate(DEFAULTS)
    expect(r.rows[39].revenuAnnuelBrut).toBeCloseTo(r.capitalInvestiFinal * 0.05, 6)
  })

  it('sans VP, le versement initial rapporte le rendement plein dès l\'année 1', () => {
    const r = simulate({ ...DEFAULTS, vpMensuel: 0, droitsEntree: 0 })
    expect(r.rows[0].revenuAnnuelBrut).toBeCloseTo(10000 * 0.05, 9)
  })
})

describe('scpiViVp — frottement fiscal', () => {
  it('à 0 %, net = brut', () => {
    const r = simulate(DEFAULTS)
    for (const row of r.rows) expect(row.revenuAnnuelNet).toBe(row.revenuAnnuelBrut)
    expect(r.revenuMensuelNetFinal).toBe(r.revenuMensuelBrutFinal)
  })

  it('réduit les revenus sans toucher au capital', () => {
    const brut = simulate(DEFAULTS)
    const net = simulate({ ...DEFAULTS, frottementFiscal: 30 })
    expect(net.capitalInvestiFinal).toBe(brut.capitalInvestiFinal)
    expect(net.totalVerseBrut).toBe(brut.totalVerseBrut)
    expect(net.totalRevenusNets).toBeCloseTo(brut.totalRevenusNets * 0.7, 6)
    expect(net.revenuMensuelBrutFinal).toBeCloseTo(brut.revenuMensuelBrutFinal, 9)
  })

  it('à 100 %, il ne reste aucun revenu', () => {
    const r = simulate({ ...DEFAULTS, frottementFiscal: 100 })
    expect(r.totalRevenusNets).toBe(0)
    expect(r.revenuMensuelBrutFinal).toBeGreaterThan(0)
  })
})

describe('scpiViVp — scénario dividendes réinvestis', () => {
  const r = simulate(DEFAULTS)

  it('dépasse toujours le capital simplement investi', () => {
    expect(r.capitalReinvestiFinal).toBeGreaterThan(r.capitalInvestiFinal)
    expect(r.gainReinvestissement).toBeCloseTo(r.capitalReinvestiFinal - r.capitalInvestiFinal, 9)
    for (const row of r.rows) {
      expect(row.capitalReinvesti).toBeGreaterThanOrEqual(row.capitalInvesti - 1e-9)
    }
  })

  it('ne réinvestit que le dividende net de frottement, droits d\'entrée déduits', () => {
    const viNet = 10000 * 0.952
    const vpNet = 750 * 12 * 0.952
    // An 1 : même base de rendement que le scénario distribué.
    expect(r.rows[0].revenuAnnuelReinvesti).toBeCloseTo(r.rows[0].revenuAnnuelNet, 9)
    // Le capital réinvesti de l'an 1 = versements nets + dividende net moins droits.
    expect(r.rows[0].capitalReinvesti).toBeCloseTo(
      viNet + vpNet + r.rows[0].revenuAnnuelReinvesti * 0.952, 6)
  })

  it('ne produit de revenu sur le dividende réinvesti qu\'à partir de l\'année suivante', () => {
    // An 2 : la base inclut le dividende de l'an 1, ce qui la rend supérieure
    // à celle du scénario distribué.
    expect(r.rows[1].revenuAnnuelReinvesti).toBeGreaterThan(r.rows[1].revenuAnnuelNet)
  })

  it('creuse un écart croissant avec le scénario distribué', () => {
    const ecarts = r.rows.map(x => x.capitalReinvesti - x.capitalInvesti)
    for (let i = 1; i < ecarts.length; i++) expect(ecarts[i]).toBeGreaterThanOrEqual(ecarts[i - 1])
  })

  it('reste égal au capital investi quand le rendement est nul', () => {
    const zero = simulate({ ...DEFAULTS, tauxRendement: 0 })
    expect(zero.capitalReinvestiFinal).toBeCloseTo(zero.capitalInvestiFinal, 6)
    expect(zero.gainReinvestissement).toBeCloseTo(0, 6)
  })

  it('ne réinvestit rien si le frottement fiscal absorbe tout le dividende', () => {
    const tout = simulate({ ...DEFAULTS, frottementFiscal: 100 })
    expect(tout.capitalReinvestiFinal).toBeCloseTo(tout.capitalInvestiFinal, 6)
  })

  it('expose le revenu mensuel du scénario réinvesti', () => {
    expect(r.revenuMensuelReinvestiFinal).toBeGreaterThan(r.revenuMensuelNetFinal)
    expect(r.revenuMensuelReinvestiFinal)
      .toBeCloseTo(r.rows[r.rows.length - 1].revenuAnnuelReinvesti / 12, 9)
  })
})

describe('scpiViVp — versements hors simulation', () => {
  it('signale les versements programmés jamais simulés', () => {
    const r = simulate({ ...DEFAULTS, dureeVp: 40, dureeTotale: 10 })
    expect(r.rows).toHaveLength(10)
    expect(r.anneesVpIgnorees).toBe(30)
    expect(r.versementsIgnores).toBe(30 * 750 * 12)
  })

  it('ne signale rien quand la simulation couvre les versements', () => {
    const r = simulate(DEFAULTS)
    expect(r.anneesVpIgnorees).toBe(0)
    expect(r.versementsIgnores).toBe(0)
  })
})

describe('scpiViVp — cas limites', () => {
  it('rendement nul : aucun revenu, capital intact', () => {
    const r = simulate({ ...DEFAULTS, tauxRendement: 0 })
    expect(r.totalRevenusNets).toBe(0)
    expect(r.capitalInvestiFinal).toBeCloseTo(r.totalVerseBrut * 0.952, 6)
  })

  it('droits d\'entrée nuls : capital investi = total versé', () => {
    const r = simulate({ ...DEFAULTS, droitsEntree: 0 })
    expect(r.capitalInvestiFinal).toBe(r.totalVerseBrut)
    expect(r.totalDroitsEntree).toBe(0)
  })

  it('aucun versement programmé : seul le versement initial travaille', () => {
    const r = simulate({ ...DEFAULTS, vpMensuel: 0 })
    expect(r.totalVerseBrut).toBe(10000)
    expect(r.rows.every(x => x.versementBrutAnnee === (x.annee === 1 ? 10000 : 0))).toBe(true)
  })

  it('tout à zéro : aucun NaN, tout reste nul', () => {
    const r = simulate({
      tauxRendement: 0, versementInitial: 0, vpMensuel: 0,
      dureeVp: 0, dureeTotale: 0, droitsEntree: 0, frottementFiscal: 0,
    })
    expect(r.rows).toHaveLength(1) // durée plancher à 1 an
    for (const v of [r.capitalInvestiFinal, r.totalVerseBrut, r.totalDroitsEntree,
      r.totalRevenusNets, r.revenuMensuelNetFinal, r.versementsIgnores]) {
      expect(Number.isFinite(v)).toBe(true)
      expect(v).toBe(0)
    }
  })

  it('droits d\'entrée à 100 % : rien n\'est investi, mais tout est sorti de poche', () => {
    const r = simulate({ ...DEFAULTS, droitsEntree: 100 })
    expect(r.capitalInvestiFinal).toBe(0)
    expect(r.totalVerseBrut).toBe(235000)
    expect(r.totalRevenusNets).toBe(0)
  })
})
