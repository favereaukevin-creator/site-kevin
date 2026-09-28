// Briques communes des simulateurs : champs de saisie, tuiles, courbes.

import { useId, useMemo, useState, type ReactNode } from 'react'

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
export const fmtEUR = (v: number) => (Number.isFinite(v) ? eur.format(Math.round(v)) : '—')
export const fmtPct = (v: number, d = 1) => `${(v * 100).toLocaleString('fr-FR', { maximumFractionDigits: d })} %`

/**
 * Lecture tolérante d'un montant : « 1 200 », « 1200,50 » ou « 1.5 ».
 * Un champ type="number" renvoie une valeur vide dès qu'il juge la saisie
 * invalide — le montant disparaissait alors du calcul sans prévenir.
 */
export function lireNombre(texte: string): number | null {
  const propre = texte.replace(/[\s  €%]/g, '').replace(',', '.')
  if (propre === '' || propre === '-') return null
  const n = Number(propre)
  return Number.isFinite(n) ? n : null
}

const affiche = (v: number) => v.toLocaleString('fr-FR', { maximumFractionDigits: 2 })

export function Champ({ libelle, valeur, onChange, unite, aide, min, max }: {
  libelle: string
  valeur: number
  onChange: (v: number) => void
  unite?: string
  aide?: ReactNode
  min?: number
  max?: number
}) {
  const id = useId()
  const [texte, setTexte] = useState(affiche(valeur))
  const [focus, setFocus] = useState(false)
  return (
    <div className="champ">
      <label htmlFor={id}>{libelle}</label>
      <div className="saisie">
        <input
          id={id} type="text" inputMode="decimal" autoComplete="off"
          value={focus ? texte : affiche(valeur)}
          onFocus={() => { setTexte(affiche(valeur)); setFocus(true) }}
          onBlur={() => setFocus(false)}
          onChange={e => {
            setTexte(e.target.value)
            const n = lireNombre(e.target.value)
            if (n === null) return
            onChange(Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n)))
          }}
        />
        {unite && <span className="unite">{unite}</span>}
      </div>
      {aide && <div className="aide">{aide}</div>}
    </div>
  )
}

export function Choix<T extends string | number>({ libelle, valeur, options, onChange, aide }: {
  libelle: string
  valeur: T
  options: Array<{ valeur: T; texte: string }>
  onChange: (v: T) => void
  aide?: ReactNode
}) {
  const id = useId()
  return (
    <div className="champ">
      <label htmlFor={id}>{libelle}</label>
      <div className="saisie">
        <select id={id} value={String(valeur)}
          onChange={e => onChange(options.find(o => String(o.valeur) === e.target.value)!.valeur)}>
          {options.map(o => <option key={String(o.valeur)} value={String(o.valeur)}>{o.texte}</option>)}
        </select>
        <span className="unite" aria-hidden="true">▾</span>
      </div>
      {aide && <div className="aide">{aide}</div>}
    </div>
  )
}

export function Tuile({ libelle, valeur, aide, ton }: {
  libelle: string
  valeur: ReactNode
  aide?: ReactNode
  ton?: 'sombre' | 'or'
}) {
  return (
    <div className={`tuile${ton ? ` tuile--${ton}` : ''}`}>
      <div className="tuile-libelle">{libelle}</div>
      <div className="tuile-valeur">{valeur}</div>
      {aide && <div className="tuile-aide">{aide}</div>}
    </div>
  )
}

export interface Serie { nom: string; couleur: string; valeurs: number[]; pointille?: boolean }

const abrege = (v: number) => {
  const a = Math.abs(v)
  if (a >= 1_000_000) return `${(v / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M€`
  if (a >= 1_000) return `${Math.round(v / 1_000)} k€`
  return `${Math.round(v)} €`
}

/** Courbes annuelles, avec lecture au survol. */
export function Courbes({ titre, series, marqueur }: {
  titre: string
  series: Serie[]
  /** Année à signaler d'un trait vertical (ex. année de bascule). */
  marqueur?: { annee: number; texte: string } | null
}) {
  const [survol, setSurvol] = useState<number | null>(null)
  const n = series[0]?.valeurs.length ?? 0
  const W = 720, H = 280, g = 58, d = 16, h = 16, b = 30
  const { bas, haut, pas } = useMemo(() => {
    const toutes = series.flatMap(s => s.valeurs)
    const max = Math.max(0, ...toutes), min = Math.min(0, ...toutes)
    const brut = (max - min) / 4 || 1
    const p10 = Math.pow(10, Math.floor(Math.log10(brut)))
    const pas = [1, 2, 2.5, 5, 10].map(m => m * p10).find(m => m >= brut) ?? brut
    return { bas: Math.floor(min / pas) * pas, haut: Math.ceil(max / pas) * pas || pas, pas }
  }, [series])
  const x = (i: number) => g + (n <= 1 ? 0 : (i / (n - 1)) * (W - g - d))
  const y = (v: number) => h + ((haut - v) / (haut - bas)) * (H - h - b)
  const graduations: number[] = []
  for (let v = bas; v <= haut + pas / 2; v += pas) graduations.push(v)
  const pasX = n <= 12 ? 1 : n <= 26 ? 5 : 10

  return (
    <div className="graphique">
      <h3>{titre}</h3>
      <div className="legende">
        {series.map(s => <span key={s.nom}><i style={{ background: s.couleur }} />{s.nom}</span>)}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}
        onMouseLeave={() => setSurvol(null)}
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect()
          const px = ((e.clientX - r.left) / r.width) * W
          setSurvol(Math.max(0, Math.min(n - 1, Math.round(((px - g) / (W - g - d)) * (n - 1)))))
        }}>
        {graduations.map(v => (
          <g key={v}>
            <line x1={g} x2={W - d} y1={y(v)} y2={y(v)} stroke={v === 0 ? '#b8ad9c' : '#e7e0d4'} />
            <text x={g - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#857e74">{abrege(v)}</text>
          </g>
        ))}
        {Array.from({ length: n }, (_, i) => i + 1).filter(a => a === 1 || a % pasX === 0).map(a => (
          <text key={a} x={x(a - 1)} y={H - 8} textAnchor="middle" fontSize="11" fill="#857e74">{a}</text>
        ))}
        {marqueur && marqueur.annee <= n && (
          <g>
            <line x1={x(marqueur.annee - 1)} x2={x(marqueur.annee - 1)} y1={h} y2={H - b} stroke="#b0894f" strokeDasharray="4 4" />
            <text x={x(marqueur.annee - 1) + 6} y={h + 12} fontSize="11.5" fill="#8a6a38">{marqueur.texte}</text>
          </g>
        )}
        {series.map(s => (
          <path key={s.nom} fill="none" stroke={s.couleur} strokeWidth={2.5} strokeLinejoin="round"
            strokeDasharray={s.pointille ? '6 5' : undefined}
            d={s.valeurs.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')} />
        ))}
        {survol !== null && (
          <g>
            <line x1={x(survol)} x2={x(survol)} y1={h} y2={H - b} stroke="#2b251e" opacity=".25" />
            {series.map(s => <circle key={s.nom} cx={x(survol)} cy={y(s.valeurs[survol])} r={4.5} fill={s.couleur} stroke="#fffdfa" strokeWidth={2} />)}
          </g>
        )}
      </svg>
      <div className="legende" style={{ minHeight: 22, marginTop: 4 }}>
        {survol !== null
          ? <><strong style={{ color: 'var(--encre)' }}>Année {survol + 1}</strong>{series.map(s => <span key={s.nom}>{s.nom} : {fmtEUR(s.valeurs[survol])}</span>)}</>
          : <span>Survolez le graphique pour lire une année.</span>}
      </div>
    </div>
  )
}
