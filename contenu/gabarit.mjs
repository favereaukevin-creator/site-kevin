// Gabarit commun du site de Kevin Favereau : un seul en-tête, un seul pied.

import { ARENSEIGNER } from './editeur.mjs'

/**
 * Deux régimes de diffusion, comme pour Lignée.
 *   restreinte — en ligne mais non référencé : une préversion qu'on partage par lien.
 *   publique   — ouvert et indexé ; exige que tous les contenus « à compléter »
 *                aient été remplis (la construction s'arrête sinon).
 */
export const DIFFUSION = process.env.DIFFUSION === 'publique' ? 'publique' : 'restreinte'
export const PUBLIQUE = DIFFUSION === 'publique'

export const NOM = 'Kevin Favereau'
export const METIER = 'Conseil en ingénierie patrimoniale'
export const ANNEE = 2026
export const SITE = (process.env.SITE_URL || 'https://favereaukevin.fr').replace(/\/$/, '')
export const BASE = (process.env.BASE_URL || '/').replace(/\/*$/, '/')

/** Coordonnées publiées sur le site. */
export const CONTACT = {
  courriel: 'conseil@favereaukevin.fr',
  telephone: ARENSEIGNER.telephone,
  telephoneLien: '+33' + ARENSEIGNER.telephone.replace(/\s/g, '').replace(/^0/, ''),
}

export const LIGNEE = 'https://favereaukevin-creator.github.io/lignee/'

const NAV = [
  { href: '/', texte: 'Accueil' },
  { href: '/simulateurs.html', texte: 'Simulateurs' },
  { href: '/ressources.html', texte: 'Ressources' },
  { href: '/a-propos.html', texte: 'À propos' },
]

/** Logo : carré vert « kf » et nom. */
export const logo = (sousTitre = true) => `<a class="logo" href="/"><span><span class="logo-nom">${NOM}</span>${sousTitre ? `<small>${METIER}</small>` : ''}</span></a>`

/** Icônes au trait, dessinées à la main pour rester légères. */
const trait = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`
export const ICONES = {
  epargne: trait('<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>'),
  retraite: trait('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  immobilier: trait('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
  transmission: trait('<path d="M12 3v6"/><path d="M6 21v-5a6 6 0 0 1 12 0v5"/><circle cx="12" cy="11" r="2"/><path d="M4 21h16"/>'),
  scpi: trait('<rect x="3" y="8" width="7" height="13"/><rect x="14" y="3" width="7" height="18"/><path d="M6 12h1M6 16h1M17 7h1M17 11h1M17 15h1"/>'),
  per: trait('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  maison: trait('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M15 3v3"/>'),
  succession: trait('<path d="M7 3h10v4a5 5 0 0 1-10 0z"/><path d="M12 12v4"/><path d="M8 21h8"/><path d="M10 16h4v5h-4z"/>'),
  credit: trait('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>'),
  locatif: trait('<path d="M4 21V9l8-6 8 6v12"/><path d="M9 21v-5h6v5"/><path d="M9 11h6"/>'),
  telephone: trait('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/>'),
  courriel: trait('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  agenda: trait('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h2M14 14h2M8 18h2"/>'),
  guide: trait('<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2"/><path d="M8 7h7M8 11h5"/>'),
}

const nav = (courante) => NAV.map(l =>
  `<a href="${l.href}"${l.href === courante ? ' aria-current="page"' : ''}>${l.texte}</a>`).join('\n        ')

const pied = () => `
  <footer class="pied">
    <div class="bloc">
      <div class="pied-grille">
        <div>
          ${logo()}
          <p style="margin:0;max-width:36ch">${METIER}. Un accompagnement clair et chiffré, pour les particuliers et les chefs d'entreprise.</p>
        </div>
        <div>
          <h4>Le site</h4>
          <ul>
            <li><a href="/simulateurs.html">Simulateurs</a></li>
            <li><a href="/ressources.html">Ressources</a></li>
            <li><a href="/a-propos.html">À propos</a></li>
            <li><a href="${LIGNEE}" rel="noopener">Lignée, guides succession</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:${CONTACT.telephoneLien}">${CONTACT.telephone}</a></li>
            <li><a href="mailto:${CONTACT.courriel}">${CONTACT.courriel}</a></li>
            <li><a href="/rendez-vous.html">Prendre rendez-vous</a></li>
            <li><a href="/mentions-legales.html">Mentions légales et confidentialité</a></li>
          </ul>
        </div>
      </div>
      <p class="pied-legal">
        © ${ANNEE} ${NOM} — ORIAS ${ARENSEIGNER.orias} (<a href="https://www.orias.fr" rel="noopener">orias.fr</a>) :
        mandataire d'intermédiaire d'assurance et mandataire d'intermédiaire en opérations de
        banque et en services de paiement, sous le contrôle de l'ACPR. Les simulateurs donnent
        des ordres de grandeur indicatifs et ne constituent pas un conseil personnalisé.
      </p>
    </div>
  </footer>`

export function page({ slug, titre, description, contenu, script = null }) {
  const url = slug === 'index' ? '/' : `/${slug}.html`
  const titreComplet = slug === 'index' ? `${NOM} · ${METIER}` : `${titre} · ${NOM}`
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${titreComplet}</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${titreComplet}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${SITE}${url}" />
  <meta property="og:locale" content="fr_FR" />
  <meta name="theme-color" content="#f6f5f1" />
  ${PUBLIQUE ? '' : '<meta name="robots" content="noindex, nofollow" />'}
  <link rel="canonical" href="${SITE}${url}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap" />
  <link rel="stylesheet" href="/src/styles/site.css" />
</head>
<body>
  <header class="entete">
    <div class="bloc">
      ${logo()}
      <nav class="nav" aria-label="Navigation principale">
        ${nav(url)}
      </nav>
      <a class="btn" href="/rendez-vous.html">Prendre rendez-vous</a>
    </div>
  </header>
  <main>
${contenu}
  </main>
${pied()}
${script ? `  <script type="module" src="${script}"></script>` : ''}
</body>
</html>
`
}
