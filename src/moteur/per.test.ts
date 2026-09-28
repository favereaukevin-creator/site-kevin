import { describe, expect, it } from 'vitest'
import { plafondSalarie, simulePer, PER_PLAFOND_MIN_2026, PER_PLAFOND_MAX_2026, type PerParams } from './per'

const base: PerParams = {
  revenusActivite: 50_000, tmi: 0.30, versementAnnuel: 3_000, plafondAvis: null,
  age: 45, anneesAvantRetraite: 20, rendement: 0.03,
}

describe('plafond de déduction PER 2026', () => {
  it('vaut 10 % des revenus d’activité', () => {
    expect(plafondSalarie(50_000)).toBe(5_000)
  })
  it('ne descend pas sous le plancher de 4 710 €', () => {
    expect(plafondSalarie(0)).toBe(PER_PLAFOND_MIN_2026)
    expect(plafondSalarie(20_000)).toBe(4_710)
  })
  it('ne dépasse pas 37 680 €', () => {
    expect(plafondSalarie(1_000_000)).toBe(PER_PLAFOND_MAX_2026)
  })
})

describe('économie d’impôt', () => {
  it('vaut versement × TMI sous le plafond', () => {
    const r = simulePer(base)
    expect(r.economieAnnuelle).toBe(900)
    expect(r.effortReelAnnuel).toBe(2_100)
    expect(r.effortReelMensuel).toBe(175)
    expect(r.depassement).toBe(0)
  })
  it('s’arrête au plafond', () => {
    const r = simulePer({ ...base, versementAnnuel: 8_000 })
    expect(r.versementDeductible).toBe(5_000)
    expect(r.depassement).toBe(3_000)
    expect(r.economieAnnuelle).toBe(1_500)
  })
  it('retient le plafond de l’avis d’impôt quand il est saisi', () => {
    const r = simulePer({ ...base, versementAnnuel: 8_000, plafondAvis: 12_000 })
    expect(r.plafondRetenu).toBe(12_000)
    expect(r.economieAnnuelle).toBe(2_400)
  })
  it('ne déduit plus rien à partir de 70 ans (règle 2026)', () => {
    const r = simulePer({ ...base, age: 70 })
    expect(r.deductible).toBe(false)
    expect(r.economieAnnuelle).toBe(0)
    expect(r.effortReelAnnuel).toBe(3_000)
  })
  it('à TMI nulle, aucun gain fiscal', () => {
    expect(simulePer({ ...base, tmi: 0 }).economieAnnuelle).toBe(0)
  })
})

describe('projection jusqu’à la retraite', () => {
  it('sans rendement, le capital égale les versements', () => {
    const r = simulePer({ ...base, rendement: 0 })
    expect(r.capitalRetraite).toBe(60_000)
    expect(r.totalVerse).toBe(60_000)
    expect(r.totalEconomies).toBe(18_000)
  })
  it('avec rendement, le capital dépasse les versements', () => {
    const r = simulePer(base)
    expect(r.capitalRetraite).toBeGreaterThan(r.totalVerse)
    // 20 versements de 3 000 € à 3 %, placés en milieu d'année :
    // 3 000 × 1,015 × 26,870 ≈ 81 820 €.
    expect(r.capitalRetraite).toBeCloseTo(81_820, -1)
  })
})
