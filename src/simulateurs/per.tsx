import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { simulePer, TRANCHES, PER_PLAFOND_MIN_2026, PER_PLAFOND_MAX_2026, type PerParams } from '../moteur/per'
import { Champ, Choix, Courbes, Tuile, fmtEUR, fmtPct } from './ui'

const DEFAUTS: PerParams = {
  revenusActivite: 45_000, tmi: 0.30, versementAnnuel: 3_000, plafondAvis: null,
  age: 40, anneesAvantRetraite: 24, rendement: 0.03,
}

function Simulateur() {
  const [p, setP] = useState(DEFAUTS)
  const [avis, setAvis] = useState(false)
  const r = simulePer(p)
  const annees = Math.max(0, Math.round(p.anneesAvantRetraite))
  const courbe = Array.from({ length: annees }, (_, i) => simulePer({ ...p, anneesAvantRetraite: i + 1 }))

  return (
    <div className="simu">
      <div className="panneau">
        <h2>Votre situation</h2>
        <Choix libelle="Tranche marginale d'imposition" valeur={p.tmi}
          options={TRANCHES.map(t => ({ valeur: t, texte: fmtPct(t, 0) }))}
          onChange={v => setP(x => ({ ...x, tmi: v }))}
          aide="Elle figure sur votre avis d'impôt sous le nom de « taux marginal »." />
        <Champ libelle="Versement annuel" valeur={p.versementAnnuel} onChange={v => setP(x => ({ ...x, versementAnnuel: v }))} unite="€/an" min={0} />
        <Choix libelle="Plafond de déduction" valeur={avis ? 'avis' : 'calcul'}
          options={[{ valeur: 'calcul', texte: 'Le calculer (salarié)' }, { valeur: 'avis', texte: 'Je connais celui de mon avis' }]}
          onChange={v => { setAvis(v === 'avis'); setP(x => ({ ...x, plafondAvis: v === 'avis' ? (x.plafondAvis ?? r.plafondCalcule) : null })) }} />
        {avis
          ? <Champ libelle="Plafond indiqué sur l'avis d'impôt" valeur={p.plafondAvis ?? r.plafondCalcule}
              onChange={v => setP(x => ({ ...x, plafondAvis: v }))} unite="€" min={0}
              aide="Rubrique « plafond épargne retraite » : il inclut les plafonds non utilisés des années précédentes." />
          : <Champ libelle="Revenus d'activité de l'an dernier" valeur={p.revenusActivite}
              onChange={v => setP(x => ({ ...x, revenusActivite: v }))} unite="€/an" min={0}
              aide="Salaires nets imposables, après la déduction de 10 % pour frais professionnels." />}
        <Champ libelle="Âge" valeur={p.age} onChange={v => setP(x => ({ ...x, age: v }))} unite="ans" min={18} max={99} />
        <Champ libelle="Années avant la retraite" valeur={p.anneesAvantRetraite} onChange={v => setP(x => ({ ...x, anneesAvantRetraite: v }))} unite="ans" min={0} max={50} />
        <Champ libelle="Rendement du contrat" valeur={p.rendement * 100} onChange={v => setP(x => ({ ...x, rendement: v / 100 }))} unite="%/an" min={0} max={15}
          aide="Net de frais de gestion. Hypothèse constante, non garantie." />
      </div>

      <div className="resultats">
        {!r.deductible && <div className="alerte">Depuis le 1er janvier 2026, les versements effectués à partir de 70 ans ne sont plus déductibles du revenu imposable.</div>}
        {r.deductible && r.depassement > 0 && (
          <div className="alerte">{fmtEUR(r.depassement)} de votre versement dépassent le plafond de déduction ({fmtEUR(r.plafondRetenu)}) et n'ouvrent droit à aucune économie d'impôt.</div>
        )}
        <div className="tuiles">
          <Tuile ton="sombre" libelle="Économie d'impôt" valeur={fmtEUR(r.economieAnnuelle)}
            aide={`par an, soit ${fmtEUR(r.economieAnnuelle / 12)} par mois`} />
          <Tuile ton="or" libelle="Coût réel du versement" valeur={fmtEUR(r.effortReelAnnuel)}
            aide={`${fmtEUR(r.effortReelMensuel)} par mois pour ${fmtEUR(p.versementAnnuel / 12)} épargnés`} />
          <Tuile libelle="Plafond de déduction retenu" valeur={fmtEUR(r.plafondRetenu)}
            aide={p.plafondAvis != null ? "celui de votre avis d'impôt" : `10 % des revenus, entre ${fmtEUR(PER_PLAFOND_MIN_2026)} et ${fmtEUR(PER_PLAFOND_MAX_2026)}`} />
          {annees > 0 && <Tuile libelle="Capital à la retraite" valeur={fmtEUR(r.capitalRetraite)}
            aide={`pour ${fmtEUR(r.totalVerse)} versés et ${fmtEUR(r.totalEconomies)} d'impôt économisé`} />}
        </div>

        {annees > 1 && (
          <Courbes titre="Ce que le PER construit" series={[
            { nom: 'Capital du contrat', couleur: '#c8703a', valeurs: courbe.map(c => c.capitalRetraite) },
            { nom: 'Versements cumulés', couleur: '#16433a', valeurs: courbe.map(c => c.totalVerse) },
            { nom: 'Impôt économisé cumulé', couleur: '#6b8aa0', valeurs: courbe.map(c => c.totalEconomies), pointille: true },
          ]} />
        )}

        <p className="hypotheses">
          <strong>Hypothèses et limites.</strong> Économie calculée au taux marginal : si la
          déduction vous fait changer de tranche, elle est un peu plus faible. Plafond 2026 d'un
          salarié : 10 % des revenus d'activité nets de l'année précédente, au minimum
          {' '}{fmtEUR(PER_PLAFOND_MIN_2026)} et au maximum {fmtEUR(PER_PLAFOND_MAX_2026)} ; un
          travailleur non salarié dispose d'un plafond plus large, à lire sur son avis d'impôt.
          L'avantage est un différé d'impôt : à la sortie, le capital issu des versements déduits
          est imposé au barème de l'impôt sur le revenu, et les gains au prélèvement forfaitaire
          unique (12,8 % d'impôt et 18,6 % de prélèvements sociaux en 2026). Le
          capital est en principe bloqué jusqu'à la retraite, sauf cas de déblocage anticipé
          (dont l'achat de la résidence principale). Versements supposés constants, rendement
          net de frais constant, placés en milieu d'année.
        </p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('app')!).render(<StrictMode><Simulateur /></StrictMode>)
