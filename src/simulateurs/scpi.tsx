import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { simulate, type ScpiViVpParams } from '../moteur/scpi'
import { Atelier, Champ, Courbes, Tuile, Vedette, fmtEUR } from './ui'

const DEFAUTS: ScpiViVpParams = {
  tauxRendement: 5, versementInitial: 10_000, vpMensuel: 200,
  dureeVp: 15, dureeTotale: 20, droitsEntree: 0, frottementFiscal: 0,
}

function Simulateur() {
  const [p, setP] = useState(DEFAUTS)
  const maj = (k: keyof ScpiViVpParams) => (v: number) => setP(x => ({ ...x, [k]: v }))
  const r = simulate(p)
  const net = p.frottementFiscal > 0 ? `nets de ${p.frottementFiscal} % de fiscalité` : 'bruts de fiscalité'
  const dernier = r.rows[r.rows.length - 1]

  return (
    <>
      <Atelier reinitialiser={() => setP(DEFAUTS)} hypotheses={<>
        <Champ libelle="Taux de distribution" valeur={p.tauxRendement} onChange={maj('tauxRendement')} unite="%/an" min={0} max={20} curseur={[0, 10, 0.1]}
          aide="Hypothèse constante. Le taux de distribution d'une SCPI n'est pas garanti." />
        <Champ libelle="Versement initial" valeur={p.versementInitial} onChange={maj('versementInitial')} unite="€" min={0} curseur={[0, 200_000, 1_000]} />
        <Champ libelle="Versement programmé" valeur={p.vpMensuel} onChange={maj('vpMensuel')} unite="€/mois" min={0} curseur={[0, 3_000, 50]} />
        <div className="paire">
          <Champ libelle="Durée des versements" valeur={p.dureeVp} onChange={maj('dureeVp')} unite="ans" min={0} max={50} curseur={[0, 40, 1]} />
          <Champ libelle="Durée totale" valeur={p.dureeTotale} onChange={maj('dureeTotale')} unite="ans" min={1} max={50} curseur={[1, 50, 1]} />
        </div>
        <Champ libelle="Frais de souscription" valeur={p.droitsEntree} onChange={maj('droitsEntree')} unite="%" min={0} max={20} curseur={[0, 12, 0.5]}
          aide="Souvent 8 à 12 % en direct ; certaines SCPI n'en prélèvent pas." />
        <Champ libelle="Fiscalité sur les revenus" valeur={p.frottementFiscal} onChange={maj('frottementFiscal')} unite="%" min={0} max={70} curseur={[0, 60, 1]}
          aide="0 % = revenus bruts. SCPI française : votre tranche + 17,2 %. SCPI européenne : souvent 5 à 8 %." />
      </>}>
        {p.dureeVp > p.dureeTotale && (
          <div className="alerte">
            Les versements courent sur {p.dureeVp} ans mais la projection s'arrête à {p.dureeTotale} ans :
            {' '}{fmtEUR(r.versementsIgnores)} de versements ne sont pas pris en compte.
          </div>
        )}
        <Vedette chiffres={[
          { libelle: 'Capital investi', valeur: fmtEUR(r.capitalInvestiFinal),
            aide: `au bout de ${p.dureeTotale} ans${r.totalDroitsEntree > 0 ? `, après ${fmtEUR(r.totalDroitsEntree)} de frais` : ''}` },
          { libelle: 'Revenu mensuel au terme', valeur: fmtEUR(r.revenuMensuelNetFinal), aide: `${fmtEUR(dernier.revenuAnnuelNet)} par an, ${net}` },
        ]} />
        <div className="tuiles">
          <Tuile libelle="Revenus perçus cumulés" valeur={fmtEUR(r.totalRevenusNets)} aide={`sur ${p.dureeTotale} ans, ${net}`} />
          <Tuile libelle="Si les revenus sont réinvestis" valeur={fmtEUR(r.capitalReinvestiFinal)}
            aide={`soit ${fmtEUR(r.gainReinvestissement)} de capital en plus, pour ${fmtEUR(r.revenuMensuelReinvestiFinal)} par mois ensuite`} />
        </div>
      </Atelier>

        <Courbes titre="Évolution sur la durée" series={[
          { nom: 'Capital investi', couleur: '#1f5a4d', valeurs: r.rows.map(x => x.capitalInvesti) },
          { nom: 'Capital, revenus réinvestis', couleur: '#c8703a', valeurs: r.rows.map(x => x.capitalReinvesti) },
          { nom: 'Revenus perçus cumulés', couleur: '#6b8aa0', valeurs: r.rows.map(x => x.revenusCumulesNets), pointille: true },
        ]} />

        <details className="detail">
          <summary>Détail année par année</summary>
          <div className="defile">
            <table className="tableau">
              <thead><tr><th>Année</th><th>Versé</th><th>Capital investi</th><th>Revenu mensuel</th><th>Revenus cumulés</th><th>Capital réinvesti</th></tr></thead>
              <tbody>{r.rows.map(x => (
                <tr key={x.annee}><td>{x.annee}</td><td>{fmtEUR(x.versementBrutAnnee)}</td><td>{fmtEUR(x.capitalInvesti)}</td>
                  <td>{fmtEUR(x.revenuMensuelNet)}</td><td>{fmtEUR(x.revenusCumulesNets)}</td><td>{fmtEUR(x.capitalReinvesti)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </details>

        <p className="hypotheses">
          <strong>Hypothèses.</strong> Taux de distribution constant ; prix de part stable (ni
          revalorisation ni baisse), le capital investi est donc compté à sa valeur nominale ;
          les versements de l'année ne produisent qu'un demi-exercice de revenus ; frais de
          souscription prélevés sur chaque versement ; dans le scénario réinvesti, le revenu net
          est réinvesti en fin d'année, frais déduits. Pas de délai de jouissance, de vacance ni
          de frais au-delà des frais de souscription. Une SCPI est un placement de long terme,
          peu liquide ; ni le capital ni les revenus ne sont garantis.
        </p>
    </>
  )
}

createRoot(document.getElementById('app')!).render(<StrictMode><Simulateur /></StrictMode>)
