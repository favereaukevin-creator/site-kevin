import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

// Site multi-pages : chaque .html de la racine est un point d'entrée, ce qui
// donne de vraies URL indexables plutôt qu'un routage en JavaScript.
const entrees = Object.fromEntries(
  readdirSync('.').filter(f => f.endsWith('.html'))
    .map(f => [f.replace(/\.html$/, ''), resolve(import.meta.dirname, f)]))

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: entrees,
      // Noms de fichiers stables, sans empreinte : GitHub Pages garde les pages
      // 10 minutes en cache ; une page gardée en mémoire juste avant une mise à
      // jour appelait une feuille de style qui n'existait plus, et s'affichait
      // en texte brut. Avec des noms fixes, elle trouve toujours ses fichiers.
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
})
