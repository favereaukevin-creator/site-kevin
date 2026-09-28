// Génère les fichiers HTML à la racine à partir du gabarit et du contenu,
// avant que vite build ne les prenne comme points d'entrée.

import { writeFileSync, readdirSync, unlinkSync } from 'node:fs'
import { page, SITE, BASE, PUBLIQUE, DIFFUSION } from './contenu/gabarit.mjs'
import { pages } from './contenu/pages.mjs'
import { A_COMPLETER } from './contenu/a-completer.mjs'

for (const f of readdirSync('.')) if (f.endsWith('.html')) unlinkSync(f)

// Liens internes préfixés par la base de déploiement (GitHub Pages sert le site
// sous /site-kevin/). Vite réécrit lui-même /src/... : on n'y touche pas.
const prefixe = (html) => BASE === '/'
  ? html
  : html
    .replace(/href="\/"/g, `href="${BASE}"`)
    .replace(/href="\/([a-z0-9-]+\.html)((?:#[a-z-]+)?)"/g, `href="${BASE}$1$2"`)
    .replace(/href="\/favicon\.svg"/g, `href="${BASE}favicon.svg"`)
    .replace(/src="\/(portrait[^"]*)"/g, `src="${BASE}$1"`)

// Garde-fou : on n'ouvre pas au public un « À propos » sans parcours.
if (PUBLIQUE && A_COMPLETER.parcours.length === 0) {
  console.error('\n✗ Le parcours est vide (contenu/a-completer.mjs). Construction publique refusée.\n')
  process.exit(1)
}

for (const p of pages) writeFileSync(`${p.slug}.html`, prefixe(page(p)))

writeFileSync('public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  + pages.map(p => `  <url><loc>${SITE}${p.slug === 'index' ? '/' : '/' + p.slug + '.html'}</loc></url>`).join('\n')
  + `\n</urlset>\n`)
writeFileSync('public/robots.txt', PUBLIQUE
  ? `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`
  : `User-agent: *\nDisallow: /\n`)

console.log(`${pages.length} pages générées en diffusion ${DIFFUSION} : ${pages.map(p => p.slug).join(', ')}`)
