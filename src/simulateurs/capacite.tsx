import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { capaciteEmprunt, DUREE_MAX_ANS, DUREE_MAX_DIFFERE_ANS, TAUX_EFFORT_MAX, type CapaciteParams } from '../moteur/capacite'
import { Atelier, Champ, Rubrique, Tuile, Vedette, fmtEUR, fmtPct } from './ui'

const DEFAUTS: CapaciteParams = {
  revenusMensuels: 4_000, loyersPercus: 0, chargesCredits: 0,
  tauxCredit: 0.035, tauxAssurance: 0.003, dureeAns: 25, apport: 20_000, fraisNotairePct: 0.08,
}

function Simulateur() {
  const [p, setP] = useState(DEFAUTS)
  const maj = (k: keyof CapaciteParams) => (v: number) => setP(x => ({ ...x, [k]: v }))
  const majPct = (k: keyof CapaciteParams) => (v: number) => setP(x => ({ ...x, [k]: v / 100 }))
  const r = capaciteEmprunt(p)
  const durees = [15, 20, 25].map(d => ({ d, r: capaciteEmprunt({ ...p, dureeAns: d }) }))

  return (
    <>
      <Atelier reinitialiser={() => setP(DEFAUTS)} hypotheses={<>
        <Rubrique>Vos revenus et charges</Rubrique>
        <Champ libelle="Revenus nets du foyer" valeur={p.revenusMensuels} onChange={maj('revenusMensuels')} curseur={[1_000, 20_000, 50]} unite="€/mois" min={0}
          aide="Salaires nets avant impôt, pensions, revenus d'indépendant lissés sur l'année." />
        <Champ libelle="Loyers perçus" valeur={p.loyersPercus} onChange={maj('loyersPercus')} curseur={[0, 5_000, 50]} unite="€/mois" min={0}
          aide="Les banques n'en retiennent en général que 70 %." />
        <Champ libelle="Crédits en cours" valeur={p.chargesCredits} onChange={maj('chargesCredits')} curseur={[0, 5_000, 25]} unite="€/mois" min={0}
          aide="Mensualités qui continueront après l'achat : auto, consommation, autre immobilier." />
        <Rubrique>Le crédit envisagé</Rubrique>
        <Champ libelle="Taux du crédit" valeur={p.tauxCredit * 100} onChange={majPct('tauxCredit')} curseur={[0, 8, 0.05]} unite="%" min={0} max={15} />
        <Champ libelle="Assurance emprunteur" valeur={p.tauxAssurance * 100} onChange={majPct('tauxAssurance')} curseur={[0, 1, 0.01]} unite="%/an" min={0} max={2}
          aide="Sur le capital emprunté. Comptée dans les 35 %." />
        <Champ libelle="Durée" valeur={p.dureeAns} onChange={maj('dureeAns')} curseur={[5, 30, 1]} unite="ans" min={5} max={30} />
        <Champ libelle="Apport personnel" valeur={p.apport} onChange={maj('apport')} curseur={[0, 500_000, 1_000]} unite="€" min={0} />
        <Champ libelle="Frais de notaire" valeur={p.fraisNotairePct * 100} onChange={majPct('fraisNotairePct')} curseur={[0, 10, 0.5]} unite="%" min={0} max={15}
          aide="Environ 7 à 8 % dans l'ancien, 2 à 3 % dans le neuf." />
      </>}>
        {r.dureeAuDela && (
          <div className="alerte">
            Au-delà de {DUREE_MAX_ANS} ans, un crédit n'est possible qu'avec un différé, jusqu'à {DUREE_MAX_DIFFERE_ANS} ans,
            pour un achat dans le neuf ou avec des travaux importants.
          </div>
        )}
        {r.mensualiteMax === 0 && (
          <div className="alerte">
            Vos crédits en cours représentent déjà {fmtPct(r.tauxEffortActuel)} de vos revenus : au-dessus de
            {' '}{fmtPct(TAUX_EFFORT_MAX, 0)}, un nouveau crédit suppose d'en regrouper ou d'en solder une partie.
          </div>
        )}
        <Vedette chiffres={[
          { libelle: "Capacité d'emprunt", valeur: fmtEUR(r.capital), aide: `sur ${p.dureeAns} ans à ${fmtPct(p.tauxCredit, 2)}` },
          { libelle: 'Prix du bien accessible', valeur: fmtEUR(r.prixMax), aide: `apport compris, frais de notaire de ${fmtPct(p.fraisNotairePct)} déduits` },
        ]} />
        <div className="tuiles">
          <Tuile libelle="Mensualité maximale" valeur={fmtEUR(r.mensualiteMax)}
            aide={`assurance comprise, soit ${fmtPct(TAUX_EFFORT_MAX, 0)} de ${fmtEUR(r.revenusRetenus)} retenus${p.chargesCredits > 0 ? `, moins ${fmtEUR(p.chargesCredits)} de crédits en cours` : ''}`} />
          <Tuile libelle="Reste à vivre" valeur={fmtEUR(r.resteAVivre)}
            aide="par mois, une fois tous les crédits payés. Les banques le regardent aussi." />
        </div>
      </Atelier>

        <div className="graphique">
          <h3>Selon la durée du crédit</h3>
          <div className="defile">
            <table className="tableau">
              <thead><tr><th>Durée</th><th>Mensualité</th><th>Capacité d'emprunt</th><th>Prix accessible</th><th>Coût des intérêts</th></tr></thead>
              <tbody>{durees.map(({ d, r: x }) => {
                const interets = x.mensualiteMax * d * 12 - x.capital * (1 + (p.tauxAssurance * d))
                return (
                  <tr key={d} style={d === p.dureeAns ? { fontWeight: 700 } : undefined}>
                    <td>{d} ans</td><td>{fmtEUR(x.mensualiteMax)}</td><td>{fmtEUR(x.capital)}</td>
                    <td>{fmtEUR(x.prixMax)}</td><td>{fmtEUR(Math.max(0, interets))}</td>
                  </tr>
                )
              })}</tbody>
            </table>
          </div>
          <p className="legende" style={{ marginTop: 10 }}>
            Une durée plus longue augmente le montant empruntable, mais aussi le coût total du crédit.
          </p>
        </div>

        <p className="hypotheses">
          <strong>Méthode.</strong> Règle du Haut Conseil de stabilité financière, maintenue en
          2026 : mensualités de tous les crédits, assurance comprise, limitées à 35 % des revenus
          nets avant impôt, sur 25 ans au plus. Loyers perçus retenus à 70 %. Les banques peuvent
          déroger pour une partie de leurs dossiers, et chacune apprécie aussi le reste à vivre,
          la stabilité des revenus, l'épargne et le type de projet : le montant réellement accordé
          peut donc être différent. Taux et assurance sont des hypothèses à ajuster selon les
          conditions du moment et votre profil.
        </p>
    </>
  )
}

createRoot(document.getElementById('app')!).render(<StrictMode><Simulateur /></StrictMode>)
