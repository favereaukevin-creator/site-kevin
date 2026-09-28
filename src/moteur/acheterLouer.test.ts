import { describe, expect, it } from 'vitest'
import { pmt, simuleAcheterLouer, type AcheterLouerParams } from './acheterLouer'

export const BASE: AcheterLouerParams = {
  prix: 250_000, fraisNotairePct: 0.08, apport: 30_000, tauxCredit: 0.035, dureeAns: 25,
  tauxAssurance: 0.003, taxeFonciere: 1_200, chargesCoproMens: 80, entretienPct: 0.005,
  revalorisationBienPct: 0.015, loyer: 1_000, revalorisationLoyerPct: 0.015,
  rendementPlacementPct: 0.03, horizonAns: 30,
}

describe('mensualité', () => {
  it('suit la formule d’annuité', () => {
    // 100 000 € à 3,6 % sur 20 ans : 585,11 € par mois.
    expect(pmt(0.036 / 12, 240, 100_000)).toBeCloseTo(585.11, 2)
  })
  it('à taux nul, rembourse le capital par parts égales', () => {
    expect(pmt(0, 100, 10_000)).toBe(100)
  })
  it('emprunte prix + frais de notaire − apport', () => {
    const r = simuleAcheterLouer(BASE)
    expect(r.fraisNotaire).toBe(20_000)
    expect(r.montantEmprunte).toBe(240_000)
  })
})

describe('comparaison de patrimoine', () => {
  it('le crédit est soldé à la fin de sa durée', () => {
    const r = simuleAcheterLouer(BASE)
    expect(r.annees[24].capitalRestantDu).toBeCloseTo(0, 2)
    expect(r.annees[25].coutProprietaireMens).toBeLessThan(r.annees[23].coutProprietaireMens)
  })
  it('l’année 1, le locataire est devant : les frais de notaire sont perdus pour l’acheteur', () => {
    const r = simuleAcheterLouer(BASE)
    expect(r.annees[0].ecart).toBeLessThan(0)
  })
  it('sur ce cas type, l’achat finit par l’emporter', () => {
    const r = simuleAcheterLouer(BASE)
    expect(r.anneeBascule).not.toBeNull()
    expect(r.anneeBascule!).toBeGreaterThan(1)
    expect(r.anneeBascule!).toBeLessThan(30)
  })
  it('un loyer plus élevé avance la bascule', () => {
    const cher = simuleAcheterLouer({ ...BASE, loyer: 1_400 })
    const base = simuleAcheterLouer(BASE)
    expect(cher.anneeBascule!).toBeLessThan(base.anneeBascule!)
  })
  it('un placement très rémunérateur peut rendre la location gagnante', () => {
    const r = simuleAcheterLouer({ ...BASE, rendementPlacementPct: 0.09, revalorisationBienPct: 0, loyer: 800 })
    expect(r.anneeBascule).toBeNull()
    expect(r.ecartFinal).toBeLessThan(0)
  })
  it('sans rendement ni revalorisation, les patrimoines se comparent à l’euro près', () => {
    const p = { ...BASE, rendementPlacementPct: 0, revalorisationBienPct: 0, revalorisationLoyerPct: 0, horizonAns: 1 }
    const r = simuleAcheterLouer(p)
    const a = r.annees[0]
    // Le locataire a l'apport plus les écarts mensuels ; le propriétaire, le bien moins la dette.
    const ecartMensuel = r.mensualite + 1_200 / 12 + 80 + (250_000 * 0.005) / 12 - 1_000
    expect(a.patrimoineLocataire).toBeCloseTo(30_000 + ecartMensuel * 12, 6)
    expect(a.patrimoineProprietaire).toBeCloseTo(250_000 - a.capitalRestantDu, 6)
  })
})
