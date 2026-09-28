// Contenu des pages du site.

import { ARENSEIGNER } from './editeur.mjs'
import { A_COMPLETER } from './a-completer.mjs'
import { PUBLIQUE, NOM, METIER, CONTACT, LIGNEE, monogramme } from './gabarit.mjs'

const aCompleter = (texte) => PUBLIQUE ? '' : `
          <div class="a-completer"><strong>À compléter —</strong> ${texte}</div>`

// ---------------------------------------------------------------- Accueil
const accueil = {
  slug: 'index',
  titre: NOM,
  description: `${NOM}, ${METIER.toLowerCase()} : épargne et assurance-vie, retraite, immobilier, financement et transmission. Simulateurs gratuits et prise de rendez-vous.`,
  contenu: `
    <section class="heros bloc">
      <div class="apparait">${monogramme()}</div>
      <h1 class="apparait apparait-2">${NOM}</h1>
      <p class="surtitre apparait apparait-2">${METIER}</p>
      <hr class="filet apparait apparait-3" />
      <p class="accroche apparait apparait-3">
        Un accompagnement clair et <em>chiffré</em> pour faire grandir, protéger et
        transmettre votre patrimoine — épargne et assurance-vie, retraite, immobilier,
        financement et succession — pour les particuliers comme pour les chefs d'entreprise.
      </p>
      <div class="actions apparait apparait-4">
        <a class="btn btn--grand" href="/rendez-vous.html">Prendre rendez-vous <span aria-hidden="true">→</span></a>
        <a class="btn-lien" href="/simulateurs.html">Découvrir les simulateurs <span aria-hidden="true">→</span></a>
      </div>
    </section>`,
}

// ---------------------------------------------------------------- Simulateurs
const carte = ({ href, ton, surtitre, titre, texte, etiquettes, externe = false }) => `
        <a class="carte carte--${ton}" href="${href}"${externe ? ' rel="noopener"' : ''}>
          <span class="surtitre">${surtitre}</span>
          <h3>${titre}</h3>
          <p>${texte}</p>
          <span class="etiquettes">${etiquettes.map(e => `<span class="etiquette">${e}</span>`).join('')}</span>
          <span class="carte-pied">${externe ? 'Ouvrir sur Lignée' : 'Découvrir le simulateur'}</span>
        </a>`

const bientot = (surtitre, titre) => `
        <div class="carte carte--bientot">
          <span class="surtitre">${surtitre}</span>
          <h3>${titre}</h3>
          <span class="badge">EN PRÉPARATION</span>
        </div>`

const simulateurs = {
  slug: 'simulateurs',
  titre: 'Simulateurs',
  description: 'Simulateurs patrimoniaux gratuits : SCPI, gain fiscal PER, acheter ou louer, droits de succession. Calculs faits dans votre navigateur, rien n’est transmis.',
  contenu: `
    <section class="bloc">
      <div style="padding-top:48px" class="apparait">${monogramme()}</div>
      <h1 class="titre apparait apparait-2">Simulateurs</h1>
      <p class="sous-titre apparait apparait-2">
        Choisissez l'outil adapté à votre projet. Les calculs se font dans votre
        navigateur : rien n'est transmis, rien n'est conservé.
      </p>
      <div class="grille apparait apparait-3">
${carte({ href: '/simulateur-scpi.html', ton: 'ardoise', surtitre: 'Immobilier & revenus', titre: 'SCPI',
  texte: 'Projeter le capital investi et les revenus perçus, avec un versement initial et des versements programmés, dividendes distribués ou réinvestis.',
  etiquettes: ['Revenus', 'Réinvestissement'] })}
${carte({ href: '/simulateur-per.html', ton: 'sauge', surtitre: 'Retraite & fiscalité', titre: 'Gain fiscal PER',
  texte: "Estimer l'économie d'impôt d'un versement déductible, dans la limite du plafond 2026, et le capital constitué à la retraite.",
  etiquettes: ['Déduction', 'Tranche marginale'] })}
${carte({ href: '/simulateur-acheter-louer.html', ton: 'taupe', surtitre: 'Résidence principale', titre: 'Acheter ou louer',
  texte: "Comparer, année après année, le patrimoine du propriétaire et celui du locataire qui place son apport.",
  etiquettes: ['Crédit', 'Année de bascule'] })}
${carte({ href: LIGNEE + 'simulateur.html', ton: 'crepuscule', surtitre: 'Transmission', titre: 'Droits de succession',
  texte: 'Estimer les droits dus par chaque héritier : abattements, barème du lien de parenté, assurance-vie avant et après 70 ans.',
  etiquettes: ['Barèmes 2026', 'Assurance-vie'], externe: true })}
      </div>
      <p class="section-titre">Prochainement</p>
      <div class="grille">
${bientot('Financement', "Capacité d'emprunt")}
${bientot('Immobilier & fiscalité', 'Investissement locatif')}
      </div>
    </section>`,
}

// ---------------------------------------------------------------- Ressources
const habilitations = `
            <ul class="liste-titres">
              <li><strong>ORIAS n° ${ARENSEIGNER.orias}</strong><span>Registre unique des intermédiaires en assurance, banque et finance — vérifiable sur <a href="https://www.orias.fr" rel="noopener">orias.fr</a></span></li>
              <li><strong>Mandataire d'intermédiaire d'assurance (MIA)</strong><span>Inscrit depuis le 25 septembre 2026</span></li>
              <li><strong>Mandataire d'intermédiaire en opérations de banque et en services de paiement (MIOBSP)</strong><span>Inscrit depuis le 17 juillet 2026</span></li>
              <li><strong>Association professionnelle</strong><span>Adhérent d'${ARENSEIGNER.associationMia.split(',')[0]}</span></li>
              <li><strong>Autorité de contrôle</strong><span>Autorité de contrôle prudentiel et de résolution (ACPR)</span></li>
${A_COMPLETER.diplomes.map(d => `              <li><strong>${d.titre}</strong><span>${d.detail}</span></li>`).join('\n')}
            </ul>${A_COMPLETER.diplomes.length ? '' : aCompleter('tes diplômes et certifications (intitulé, établissement, année).')}`

const partenaires = A_COMPLETER.partenaires.length
  ? `<div class="nuage">${A_COMPLETER.partenaires.map(p => `<span>${p}</span>`).join('')}</div>
            <p style="text-align:center;color:var(--libelle);font-style:italic;margin:26px 0 0;font-size:14px">Liste non exhaustive</p>`
  : aCompleter('la liste des assureurs, sociétés de gestion et banques avec lesquels tu travailles réellement. Tant qu’elle est vide, cette rubrique ne s’affiche pas sur le site public.')

const tuile = (id, numero, titre, texte) => `
        <button class="tuile-ressource" type="button" data-ouvre="${id}">
          <span class="numero">${numero}</span>
          <h2>${titre}</h2>
          <p>${texte}</p>
        </button>`

const dialogue = (id, titre, corps) => `
      <dialog id="${id}" aria-labelledby="${id}-titre">
        <div class="dialogue">
          <button class="fermer" type="button" data-ferme aria-label="Fermer">×</button>
          <h2 id="${id}-titre">${titre}</h2>
          <hr class="filet" />
          ${corps}
        </div>
      </dialog>`

const avecPartenaires = A_COMPLETER.partenaires.length > 0 || !PUBLIQUE

const ressources = {
  slug: 'ressources',
  titre: 'Ressources',
  description: `Habilitations, statuts réglementaires et partenaires de ${NOM}, et guides pour comprendre la transmission de patrimoine.`,
  script: '/src/dialogues.ts',
  contenu: `
    <section class="bloc">
      <div style="padding-top:48px" class="apparait">${monogramme()}</div>
      <h1 class="titre apparait apparait-2">Des <em>habilitations</em> vérifiables, des <em>partenaires</em> solides.</h1>
      <p class="sous-titre apparait apparait-2">Tout ce qui encadre mon activité, consultable en un clic.</p>
      <div class="duo apparait apparait-3">
${tuile('habilitations', '01', 'Diplômes & habilitations', 'Statuts réglementaires, inscription ORIAS et autorité de contrôle.')}
${avecPartenaires ? tuile('partenaires', '02', 'Partenaires', 'Les assureurs, sociétés de gestion et établissements avec lesquels je travaille.') : ''}
        <a class="tuile-ressource" href="${LIGNEE}" rel="noopener" style="text-decoration:none">
          <span class="numero">${avecPartenaires ? '03' : '02'}</span>
          <h2>Guides Lignée</h2>
          <p>Succession, donation, assurance-vie, démembrement, PER : les règles expliquées simplement.</p>
        </a>
      </div>
${dialogue('habilitations', 'Diplômes & habilitations', habilitations)}
${avecPartenaires ? dialogue('partenaires', 'Partenaires', partenaires) : ''}
    </section>`,
}

// ---------------------------------------------------------------- À propos
const chapitre = (numero, titre, corps) => `
          <div class="chapitre">
            <div class="chapitre-tete"><span class="numero">${numero}</span><h2>${titre}</h2></div>
            ${corps}
          </div>`

const parcours = A_COMPLETER.parcours.length
  ? A_COMPLETER.parcours.map(p => `<p>${p}</p>`).join('\n            ')
  : aCompleter('ton parcours en deux ou trois paragraphes : d’où tu viens, ce qui t’a amené au conseil patrimonial, ce que tu en retiens.')

const aPropos = {
  slug: 'a-propos',
  titre: 'À propos',
  description: `Parcours, méthode et cadre d'exercice de ${NOM}, ${METIER.toLowerCase()}.`,
  contenu: `
    <section class="bloc" style="padding-top:48px">
      <div class="apparait" style="margin-bottom:46px">${monogramme()}</div>
      ${PUBLIQUE ? '' : `<div class="a-completer" style="margin-bottom:34px">
        <strong>Préversion —</strong> la partie « Méthode » est une proposition de texte, à relire
        et à valider : elle ne dit que ce que je sais de ta pratique (projets chiffrés, veille à la
        source, pédagogie). Change tout ce qui ne te ressemble pas.
      </div>`}
      <div class="apropos">
        <div class="portrait apparait">
          ${A_COMPLETER.photo ? `<img src="${A_COMPLETER.photo}" alt="Portrait de ${NOM}" />` : monogramme(true)}
        </div>
        <div class="apparait apparait-2">
${chapitre('01', 'Parcours', parcours)}
${chapitre('02', 'Méthode', `
            <p>
              Tout commence par un état des lieux : revenus, charges, patrimoine, projets et
              contraintes. C'est sur cette base que je construis des recommandations, jamais
              à partir d'un produit.
            </p>
            <p>
              Chaque scénario est chiffré, année après année, avec ses hypothèses écrites noir
              sur blanc : effort d'épargne, fiscalité, patrimoine constitué. Vous comparez
              avant de décider, et vous savez sur quoi repose chaque chiffre.
            </p>
            <p>
              Je suis l'évolution des règles fiscales à la source — Bulletin officiel des
              finances publiques et Journal officiel. Une règle qui change, c'est un dossier
              que l'on revoit. Et j'explique avant de recommander : une décision patrimoniale
              doit être comprise, pas seulement signée.
            </p>`)}
${chapitre('03', "Cadre d'exercice", `
            <p>
              Je suis inscrit au registre de l'ORIAS sous le numéro ${ARENSEIGNER.orias}, en
              qualité de mandataire d'intermédiaire d'assurance et de mandataire
              d'intermédiaire en opérations de banque et en services de paiement, sous le
              contrôle de l'Autorité de contrôle prudentiel et de résolution.
            </p>
            <p>
              Toute recommandation personnalisée est précédée de la remise d'un document
              d'entrée en relation, et formalisée par écrit.
            </p>
            <p><a class="btn-lien" href="/ressources.html" style="padding-left:0">Voir les habilitations <span aria-hidden="true">→</span></a></p>`)}
        </div>
      </div>
    </section>`,
}

// ---------------------------------------------------------------- Rendez-vous
const sujet = encodeURIComponent('Demande de rendez-vous')
const rendezVous = {
  slug: 'rendez-vous',
  titre: 'Prendre rendez-vous',
  description: `Prendre rendez-vous avec ${NOM} par téléphone ou par courriel.`,
  contenu: `
    <section class="bloc">
      <div style="padding-top:48px" class="apparait">${monogramme()}</div>
      <h1 class="titre apparait apparait-2">Prendre <em>rendez-vous</em></h1>
      <p class="sous-titre apparait apparait-2">
        Un premier échange pour faire le point sur votre situation et vos projets.
      </p>
      <div class="contacts apparait apparait-3">
        <a class="contact" href="tel:${CONTACT.telephoneLien}">
          <span class="surtitre">Téléphone</span>
          <strong>${CONTACT.telephone}</strong>
          <span>Appelez ou laissez un message, je vous rappelle.</span>
        </a>
        <a class="contact" href="mailto:${CONTACT.courriel}?subject=${sujet}">
          <span class="surtitre">Courriel</span>
          <strong>${CONTACT.courriel}</strong>
          <span>Indiquez vos disponibilités et l'objet de votre demande.</span>
        </a>
      </div>
      <div class="texte apparait apparait-4" style="margin-top:56px">
        <h2 style="text-align:center">Pour préparer l'échange</h2>
        <p style="text-align:center">Rien n'est obligatoire, mais ces documents permettent d'aller plus loin dès le premier rendez-vous :</p>
        <ul>
          <li>votre dernier avis d'impôt sur le revenu ;</li>
          <li>les relevés de vos contrats d'épargne (assurance-vie, PER, livrets) ;</li>
          <li>les tableaux d'amortissement de vos crédits en cours ;</li>
          <li>une idée de vos projets : achat, retraite, transmission, revenus complémentaires.</li>
        </ul>
        <p class="note">
          Ce site ne comporte aucun formulaire : vos informations ne transitent que par
          votre propre messagerie ou votre téléphone.
        </p>
      </div>
    </section>`,
}

// ---------------------------------------------------------------- Mentions légales
const mentions = {
  slug: 'mentions-legales',
  titre: 'Mentions légales et confidentialité',
  description: `Éditeur, statuts réglementaires, hébergeur et politique de confidentialité du site de ${NOM}.`,
  contenu: `
    <section class="bloc texte" style="padding-top:48px">
      <h1 class="titre" style="margin-top:0">Mentions légales</h1>
      <p class="sous-titre" style="margin-bottom:10px">En application de l'article 6-III-1 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.</p>

      <h2>Éditeur du site</h2>
      <p>
        ${ARENSEIGNER.nom}, entrepreneur individuel (EI)<br />
        ${ARENSEIGNER.statut}<br />
        ${ARENSEIGNER.adresse}<br />
        Téléphone : ${ARENSEIGNER.telephone}<br />
        Courriel : <a href="mailto:${CONTACT.courriel}">${CONTACT.courriel}</a><br />
        ${ARENSEIGNER.tva}
      </p>
      <p>Directeur de la publication : ${ARENSEIGNER.nom}.</p>

      <h2>Statuts réglementaires</h2>
      <p>
        L'éditeur est immatriculé au registre unique des intermédiaires en assurance,
        banque et finance sous le numéro <strong>ORIAS ${ARENSEIGNER.orias}</strong>,
        consultable sur <a href="https://www.orias.fr" rel="noopener">orias.fr</a>, en qualité de :
      </p>
      <ul>
        <li>mandataire d'intermédiaire d'assurance (MIA), depuis le 25 septembre 2026 — adhérent de ${ARENSEIGNER.associationMia} ;</li>
        <li>mandataire d'intermédiaire en opérations de banque et en services de paiement (MIOBSP), depuis le 17 juillet 2026${ARENSEIGNER.associationIobsp ? ` — adhérent de ${ARENSEIGNER.associationIobsp}` : ''}.</li>
      </ul>
      <p>
        Ces activités d'intermédiation sont exercées à titre accessoire, sans encaissement
        de fonds : l'éditeur n'est pas autorisé à recevoir de sommes destinées à des
        produits d'assurance ou bancaires, et n'en reçoit aucune. Elles sont placées sous
        le contrôle de l'<a href="https://acpr.banque-france.fr" rel="noopener">${ARENSEIGNER.autorite}</a>.
      </p>
      <div class="note">
        <strong>Les informations et les simulateurs de ce site sont généraux.</strong> Ils ne
        constituent pas un conseil personnalisé au sens de la réglementation : celui-ci
        suppose un examen de votre situation et donne lieu, au préalable, à la remise d'un
        document d'entrée en relation.
      </div>

      <h2>Médiation de la consommation</h2>
      <p>
        Conformément à l'article L616-1 du Code de la consommation, tout consommateur a le
        droit de recourir gratuitement à un médiateur en vue de la résolution amiable d'un
        litige, après avoir tenté de le résoudre directement auprès de l'éditeur par écrit.
        Pour l'activité d'intermédiation en assurance : ${ARENSEIGNER.mediateur}.
      </p>

      <h2>Hébergement</h2>
      <p>
        GitHub, Inc. — 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.
        Contact : <a href="https://support.github.com" rel="noopener">support.github.com</a>
        — l'hébergeur ne publie pas de numéro de téléphone. Le site est un ensemble de
        fichiers statiques : aucune base de données, aucun traitement côté serveur.
      </p>

      <h2 id="confidentialite">Confidentialité</h2>
      <p>
        <strong>Ce site ne collecte aucune donnée personnelle.</strong> Il ne comporte ni
        formulaire, ni compte, ni outil de mesure d'audience, ni traceur publicitaire, et
        ne dépose aucun cookie.
      </p>
      <p>
        Les montants saisis dans les simulateurs sont calculés dans votre navigateur et
        n'en sortent jamais. Les polices de caractères sont chargées depuis Google Fonts,
        ce qui transmet votre adresse IP à Google : c'est le seul flux sortant du site.
      </p>

      <h2>Portée des simulations</h2>
      <p>
        Les simulateurs produisent des <strong>ordres de grandeur indicatifs</strong>,
        fondés sur des hypothèses constantes affichées sous chaque résultat. Les
        performances passées ne préjugent pas des performances futures ; les rendements
        des SCPI et des contrats d'assurance-vie ne sont pas garantis et le capital investi
        peut diminuer. L'éditeur ne saurait être tenu responsable de décisions prises sur la
        seule base de ces calculs.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, la présentation et les méthodes de calcul du site sont la propriété de
        l'éditeur. Les données publiques reproduites (barèmes, plafonds) sont librement
        réutilisables.
      </p>
    </section>`,
}

// ---------------------------------------------------------------- Pages de simulateur
const pageSimu = ({ slug, titre, description, script, surtitre, intro }) => ({
  slug, titre, description, script,
  contenu: `
    <section class="bloc" style="padding-top:40px">
      <p class="surtitre" style="text-align:center">${surtitre}</p>
      <h1 class="titre" style="margin-top:12px">${titre}</h1>
      <p class="sous-titre">${intro}</p>
      <div id="app"></div>
      <a class="retour" href="/simulateurs.html">← Tous les simulateurs</a>
    </section>`,
})

const simuScpi = pageSimu({
  slug: 'simulateur-scpi', titre: 'Simulateur SCPI', script: '/src/simulateurs/scpi.tsx',
  surtitre: 'Immobilier & revenus',
  description: 'Simulateur SCPI gratuit : capital investi, revenus perçus et scénario de réinvestissement des dividendes, avec versement initial et versements programmés.',
  intro: 'Un versement de départ, des versements programmés, et les revenus que la SCPI distribue chaque année — perçus, ou réinvestis.',
})
const simuPer = pageSimu({
  slug: 'simulateur-per', titre: 'Gain fiscal PER', script: '/src/simulateurs/per.tsx',
  surtitre: 'Retraite & fiscalité',
  description: "Simulateur PER gratuit : plafond de déduction 2026, économie d'impôt selon votre tranche marginale et capital constitué à la retraite.",
  intro: "Combien un versement sur un Plan d'épargne retraite vous fait-il économiser d'impôt, et que coûte-t-il vraiment ?",
})
const simuAchat = pageSimu({
  slug: 'simulateur-acheter-louer', titre: 'Acheter ou louer', script: '/src/simulateurs/acheter-louer.tsx',
  surtitre: 'Résidence principale',
  description: 'Acheter ou louer sa résidence principale ? Comparez année après année le patrimoine du propriétaire et celui du locataire qui place son apport.',
  intro: "À budget égal, qui s'enrichit le plus : le propriétaire qui rembourse son crédit, ou le locataire qui place son apport et la différence ?",
})

export const pages = [accueil, simulateurs, ressources, aPropos, rendezVous, mentions, simuScpi, simuPer, simuAchat]
