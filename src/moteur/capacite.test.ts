import { describe, expect, it } from 'vitest'
import { capaciteEmprunt, facteurAnnuite, type CapaciteParams } from './capacite'

const base: CapaciteParams = {
  revenusMensuels: 4_000, loyersPercus: 0, chargesCredits: 0,
  tauxCredit: 0.035, tauxAssurance: 0.003, dureeAns: 25, apport: 20_000, fraisNotairePct: 0.08,
}

describe('règle des 35 %', () => {
  it('plafonne la mensualité, assurance comprise, à 35 % des revenus', () => {
    expect(capaciteEmprunt(base).mensualiteMax).toBeCloseTo(1_400, 6)
  })
  it('retire les crédits en cours de la mensualité possible', () => {
    expect(capaciteEmprunt({ ...base, chargesCredits: 400 }).mensualiteMax).toBeCloseTo(1_000, 6)
  })
  it('ne retient les loyers perçus qu’à 70 %', () => {
    const r = capaciteEmprunt({ ...base, loyersPercus: 1_000 })
    expect(r.revenusRetenus).toBe(4_700)
    expect(r.mensualiteMax).toBeCloseTo(1_645, 6)
  })
  it('déjà au-delà de 35 % : aucune capacité', () => {
    const r = capaciteEmprunt({ ...base, chargesCredits: 1_600 })
    expect(r.mensualiteMax).toBe(0)
    expect(r.capital).toBe(0)
    expect(r.tauxEffortActuel).toBeCloseTo(0.4, 6)
  })
})

describe('montant empruntable', () => {
  it('rembourse exactement la mensualité maximale, assurance comprise', () => {
    const r = capaciteEmprunt(base)
    const mensualite = r.capital * facteurAnnuite(0.035, 300) + (r.capital * 0.003) / 12
    expect(mensualite).toBeCloseTo(1_400, 6)
    // 1 400 € par mois à 3,5 % sur 25 ans, assurance 0,30 % : environ 266 000 €.
    expect(r.capital).toBeGreaterThan(265_000)
    expect(r.capital).toBeLessThan(267_500)
  })
  it('à taux nul, capital = mensualité hors assurance × nombre de mois', () => {
    const r = capaciteEmprunt({ ...base, tauxCredit: 0, tauxAssurance: 0, dureeAns: 20 })
    expect(r.capital).toBeCloseTo(1_400 * 240, 6)
  })
  it('allonger la durée augmente la capacité', () => {
    const court = capaciteEmprunt({ ...base, dureeAns: 15 }).capital
    const long = capaciteEmprunt({ ...base, dureeAns: 25 }).capital
    expect(long).toBeGreaterThan(court)
  })
  it('le prix maximal laisse de quoi payer les frais de notaire', () => {
    const r = capaciteEmprunt(base)
    expect(r.budget).toBeCloseTo(r.capital + 20_000, 6)
    expect(r.prixMax * 1.08).toBeCloseTo(r.budget, 6)
  })
  it('signale une durée au-delà de 25 ans', () => {
    expect(capaciteEmprunt({ ...base, dureeAns: 27 }).dureeAuDela).toBe(true)
    expect(capaciteEmprunt(base).dureeAuDela).toBe(false)
  })
})
