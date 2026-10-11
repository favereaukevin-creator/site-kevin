import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { simuleAcheterLouer, type AcheterLouerParams } from '../moteur/acheterLouer'
import { Atelier, Champ, Courbes, Rubrique, Tuile, Vedette, fmtEUR } from './ui'

const DEFAUTS: AcheterLouerParams = {
  prix: 250_000, fraisNotairePct: 0.08, apport: 30_000, tauxCredit: 0.035, dureeAns: 25,
  tauxAssurance: 0.003, taxeFonciere: 1_200, chargesCoproMens: 80, entretienPct: 0.005,
  revalorisationBienPct: 0.015, loyer: 1_000, revalorisationLoyerPct: 0.015,
  rendementPlacementPct: 0.03, horizonAns: 30,
}

type Cle = keyof AcheterLouerParams
const pct = (k: Cle) => ({ pct: true as const, k })

function Simulateur() {
  const [p, setP] = useState(DEFAUTS)
  const maj = (k: Cle) => (v: number) => setP(x => ({ ...x, [k]: v }))
  const majPct = ({ k }: { k: Cle }) => (v: number) => setP(x => ({ ...x, [k]: v / 100 }))
  const r = simuleAcheterLouer(p)
  const fin = r.annees[r.annees.length - 1]
  const gagnant = r.ecartFinal >= 0 ? "l'achat" : 'la location'

  return (
    <>
      <Atelier reinitialiser={() => setP(DEFAUTS)} hypotheses={<>
        <Rubrique>Le logement</Rubrique>
        <Champ libelle="Prix du bien" valeur={p.prix} onChange={maj('prix')} curseur={[50_000, 1_500_000, 5_000]} unite="€" min={0} />
        <Champ libelle="Frais de notaire" valeur={p.fraisNotairePct * 100} onChange={majPct(pct('fraisNotairePct'))} curseur={[0, 10, 0.5]} unite="%" min={0} max={15}
          aide="Environ 7 à 8 % dans l'ancien, 2 à 3 % dans le neuf." />
        <Champ libelle="Apport personnel" valeur={p.apport} onChange={maj('apport')} curseur={[0, 500_000, 1_000]} unite="€" min={0} />
        <Champ libelle="Taux du crédit" valeur={p.tauxCredit * 100} onChange={majPct(pct('tauxCredit'))} curseur={[0, 8, 0.05]} unite="%" min={0} max={15} />
        <Champ libelle="Durée du crédit" valeur={p.dureeAns} onChange={maj('dureeAns')} curseur={[5, 30, 1]} unite="ans" min={1} max={30} />
        <Champ libelle="Assurance emprunteur" valeur={p.tauxAssurance * 100} onChange={majPct(pct('tauxAssurance'))} curseur={[0, 1, 0.01]} unite="%/an" min={0} max={2} />
        <Champ libelle="Taxe foncière" valeur={p.taxeFonciere} onChange={maj('taxeFonciere')} curseur={[0, 6_000, 50]} unite="€/an" min={0} />
        <Champ libelle="Charges de copropriété" valeur={p.chargesCoproMens} onChange={maj('chargesCoproMens')} curseur={[0, 600, 10]} unite="€/mois" min={0}
          aide="Part non récupérable, à la charge du propriétaire." />
        <Rubrique>La location</Rubrique>
        <Champ libelle="Loyer actuel" valeur={p.loyer} onChange={maj('loyer')} curseur={[200, 5_000, 10]} unite="€/mois" min={0}
          aide="Charges locatives comprises." />
        <Rubrique>Les hypothèses</Rubrique>
        <Champ libelle="Revalorisation du bien" valeur={p.revalorisationBienPct * 100} onChange={majPct(pct('revalorisationBienPct'))} curseur={[-3, 6, 0.1]} unite="%/an" min={-10} max={10} />
        <Champ libelle="Hausse des loyers et des charges" valeur={p.revalorisationLoyerPct * 100} onChange={majPct(pct('revalorisationLoyerPct'))} curseur={[-2, 6, 0.1]} unite="%/an" min={-5} max={10} />
        <Champ libelle="Rendement de l'épargne placée" valeur={p.rendementPlacementPct * 100} onChange={majPct(pct('rendementPlacementPct'))} curseur={[0, 10, 0.1]} unite="%/an" min={0} max={15}
          aide="Ce que rapporterait l'apport s'il restait placé." />
        <Champ libelle="Horizon de comparaison" valeur={p.horizonAns} onChange={maj('horizonAns')} curseur={[1, 40, 1]} unite="ans" min={1} max={40} />
      </>}>
        <Vedette chiffres={[
          { libelle: "L'achat devient gagnant",
            valeur: r.anneeBascule ? `Après ${r.anneeBascule} an${r.anneeBascule > 1 ? 's' : ''}` : 'Pas sur l’horizon',
            aide: r.anneeBascule
              ? 'à partir de cette année, le patrimoine du propriétaire dépasse celui du locataire'
              : `sur ${p.horizonAns} ans, le locataire reste devant` },
          { libelle: `Écart au bout de ${p.horizonAns} ans`, valeur: fmtEUR(Math.abs(r.ecartFinal)), aide: `en faveur de ${gagnant}` },
        ]} />
        <div className="tuiles">
          <Tuile libelle="Mensualité du crédit" valeur={fmtEUR(r.mensualite)}
            aide={`assurance comprise, pour ${fmtEUR(r.montantEmprunte)} empruntés`} />
          <Tuile libelle="Coût mensuel du propriétaire" valeur={fmtEUR(r.coutProprietaireMens1)}
            aide={`la première année, contre ${fmtEUR(p.loyer)} de loyer`} />
        </div>
      </Atelier>

        <Courbes titre="Patrimoine de chacun, année après année"
          marqueur={r.anneeBascule ? { annee: r.anneeBascule, texte: 'bascule' } : null}
          series={[
            { nom: 'Propriétaire', couleur: '#c8703a', valeurs: r.annees.map(a => a.patrimoineProprietaire) },
            { nom: 'Locataire', couleur: '#6b8aa0', valeurs: r.annees.map(a => a.patrimoineLocataire) },
          ]} />

        <details className="detail">
          <summary>Détail année par année</summary>
          <div className="defile">
            <table className="tableau">
              <thead><tr><th>Année</th><th>Coût propriétaire</th><th>Loyer</th><th>Valeur du bien</th><th>Reste dû</th><th>Patrimoine propriétaire</th><th>Patrimoine locataire</th></tr></thead>
              <tbody>{r.annees.map(a => (
                <tr key={a.annee}><td>{a.annee}</td><td>{fmtEUR(a.coutProprietaireMens)}/mois</td><td>{fmtEUR(a.loyerMens)}/mois</td>
                  <td>{fmtEUR(a.valeurBien)}</td><td>{fmtEUR(a.capitalRestantDu)}</td>
                  <td>{fmtEUR(a.patrimoineProprietaire)}</td><td>{fmtEUR(a.patrimoineLocataire)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </details>

        <p className="hypotheses">
          <strong>Comment lire ce résultat.</strong> À budget égal : le locataire place son apport
          dès le départ, puis chaque mois l'écart entre ce que lui coûterait l'achat (mensualité,
          taxe foncière, copropriété, entretien à {(p.entretienPct * 100).toLocaleString('fr-FR')} % du prix par an) et
          son loyer ; si c'est le loyer qui coûte le plus, c'est le propriétaire qui place la
          différence. Taux, rendement et revalorisations sont constants ; le rendement est brut
          de fiscalité ; les frais de revente ne sont pas déduits (ils retardent la bascule).
          La plus-value sur la résidence principale est exonérée d'impôt. Au bout de {p.horizonAns} ans,
          le bien vaudrait {fmtEUR(fin.valeurBien)} selon ces hypothèses.
        </p>
    </>
  )
}

createRoot(document.getElementById('app')!).render(<StrictMode><Simulateur /></StrictMode>)
