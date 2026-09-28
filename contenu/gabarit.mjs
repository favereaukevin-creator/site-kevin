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
export const METIER = 'Conseil en patrimoine · assurance & financement'
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

/** Monogramme KF dans un médaillon doré. */
export const monogramme = (grand = false) => `
      <svg class="monogramme${grand ? ' monogramme--grand' : ''}" viewBox="0 0 100 100" role="img" aria-label="Monogramme KF">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#c7ae89" stroke-width="1" />
        <circle cx="50" cy="50" r="41.5" fill="none" stroke="#c7ae89" stroke-width=".4" opacity=".7" />
        <path d="M50 2.2 L51.6 5 L50 7.8 L48.4 5 Z" fill="#b0894f" />
        <text x="41" y="63" text-anchor="middle" font-size="46" fill="#2b251e"
          style="font-family:'Bodoni Moda','Bodoni 72',Didot,Georgia,serif">K</text>
        <text x="60" y="71" text-anchor="middle" font-size="38" fill="#b0894f" font-style="italic"
          style="font-family:'Bodoni Moda','Bodoni 72',Didot,Georgia,serif">F</text>
      </svg>`

const nav = (courante) => NAV.map(l =>
  `<a href="${l.href}"${l.href === courante ? ' aria-current="page"' : ''}>${l.texte}</a>`).join('\n        ')

const pied = () => `
  <footer class="pied">
    <div class="bloc">
      <span>© ${ANNEE} ${NOM}</span>
      <a href="mailto:${CONTACT.courriel}">${CONTACT.courriel}</a>
      <span class="pied-liens">
        <a href="/rendez-vous.html">Rendez-vous</a>
        <a href="/mentions-legales.html">Mentions légales</a>
        <a href="/mentions-legales.html#confidentialite">Confidentialité</a>
      </span>
    </div>
    <p class="pied-legal">
      ${NOM} — ORIAS ${ARENSEIGNER.orias} (<a href="https://www.orias.fr" rel="noopener">orias.fr</a>) :
      mandataire d'intermédiaire d'assurance et mandataire d'intermédiaire en opérations
      de banque et en services de paiement, sous le contrôle de l'ACPR. Les simulateurs
      donnent des ordres de grandeur indicatifs et ne constituent pas un conseil personnalisé.
    </p>
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
  <meta name="theme-color" content="#f2eee6" />
  ${PUBLIQUE ? '' : '<meta name="robots" content="noindex, nofollow" />'}
  <link rel="canonical" href="${SITE}${url}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap" />
  <link rel="stylesheet" href="/src/styles/site.css" />
</head>
<body>
  <header class="entete">
    <div class="bloc">
      <nav class="nav" aria-label="Navigation principale">
        ${nav(url)}
      </nav>
      <a class="btn" href="/rendez-vous.html">Prendre RDV <span aria-hidden="true">→</span></a>
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
