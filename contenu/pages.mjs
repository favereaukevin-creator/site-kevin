// Contenu des pages du site.

import { ARENSEIGNER } from './editeur.mjs'
import { A_COMPLETER } from './a-completer.mjs'
import { PUBLIQUE, NOM, METIER, CONTACT, LIGNEE, ICONES } from './gabarit.mjs'

const aCompleter = (texte) => PUBLIQUE ? '' : `
          <div class="a-completer"><strong>À compléter —</strong> ${texte}</div>`

// ---------------------------------------------------------------- Accueil
const domaine = (icone, titre, texte) => `
          <div class="domaine">
            <div class="icone">${ICONES[icone]}</div>
            <h3>${titre}</h3>
            <p>${texte}</p>
          </div>`

const accueil = {
  slug: 'index',
  titre: NOM,
  description: `${NOM}, ${METIER.toLowerCase()} : une approche globale de votre patrimoine — épargne, immobilier, retraite, transmission. Simulateurs gratuits et prise de rendez-vous.`,
  contenu: `
    <section class="bloc accueil-heros">
      <div class="accueil-centre">
        <h1 class="accueil-nom apparait">${NOM}</h1>
        <p class="accueil-metier apparait">${METIER}</p>
        <span class="accueil-filet apparait apparait-2" aria-hidden="true"></span>
        <p class="accueil-chapo apparait apparait-2">
          Une approche <span class="accent">globale</span> et méthodique, bâtie autour de votre
          situation et de vos projets — épargne, immobilier, retraite et transmission — pour
          les particuliers comme pour les entreprises.
        </p>
        <div class="accueil-actions apparait apparait-3">
          <a class="btn btn--pilule" href="/rendez-vous.html">Prendre rendez-vous <span aria-hidden="true">→</span></a>
          <a class="lien-fleche" href="/simulateurs.html">Découvrir les simulateurs <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <section class="section section--blanche">
      <div class="bloc">
        <div class="section-tete">
          <p class="surtitre">Accompagnement</p>
          <h2>Chaque décision replacée dans l'ensemble</h2>
          <p>Un placement, un crédit ou une donation ne se jugent jamais seuls : ils se regardent à l'échelle de tout votre patrimoine.</p>
        </div>
        <div class="domaines">
${domaine('epargne', 'Épargne', "Faire travailler votre épargne selon votre horizon et votre tolérance au risque.")}
${domaine('retraite', 'Retraite', "Anticiper vos revenus futurs et tirer parti des dispositifs déductibles.")}
${domaine('immobilier', 'Immobilier & financement', "Résidence principale, investissement, crédit : structurer le projet et son financement.")}
${domaine('transmission', 'Transmission', "Préparer la suite, protéger vos proches et alléger ce qu'ils auront à payer.")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="bloc">
        <div class="section-tete">
          <p class="surtitre">Méthode</p>
          <h2>Trois temps, pas de raccourci</h2>
        </div>
        <div class="etapes">
          <div class="etape"><h3>L'audit patrimonial, offert</h3><p>Un premier rendez-vous pour faire le relevé complet de votre situation : revenus, charges, patrimoine, projets.</p></div>
          <div class="etape"><h3>Des préconisations sur mesure</h3><p>Préparées à partir de ce bilan, chiffrées et expliquées lors d'un second rendez-vous — jamais une solution toute faite.</p></div>
          <div class="etape"><h3>La décision, puis le suivi</h3><p>Une règle fiscale change ? Le dossier est revu. Une décision patrimoniale doit être comprise, pas seulement signée.</p></div>
        </div>
      </div>
    </section>

    <section class="bloc">
      <div class="bandeau">
        <div>
          <h2>Un projet, une question ?</h2>
          <p>Faisons le point ensemble sur votre situation.</p>
        </div>
        <div class="actions">
          <a class="btn btn--clair btn--grand" href="/rendez-vous.html">Prendre rendez-vous</a>
          <a class="btn btn--transparent btn--grand" href="tel:${CONTACT.telephoneLien}">${CONTACT.telephone}</a>
        </div>
      </div>
    </section>`,
}

// ---------------------------------------------------------------- Simulateurs
// Grandes cartes sombres : catégorie en petites capitales, titre en serif,
// étiquettes, et un lien souligné d'un trait qui s'allonge au survol.
const outil = ({ href, categorie, titre, texte, etiquettes = [], externe = false }) => `
        <a class="outil" href="${href}"${externe ? ' rel="noopener"' : ''}>
          <span class="categorie">${categorie}</span>
          <h3>${titre}</h3>
          <p>${texte}</p>
          <span class="etiquettes">${etiquettes.map(e => `<span>${e}</span>`).join('')}</span>
          <span class="lien">${externe ? 'Ouvrir sur Lignée' : 'Découvrir le simulateur'}<i aria-hidden="true"></i></span>
        </a>`

const bientot = (categorie, titre, texte) => `
        <div class="outil outil--bientot">
          <span class="categorie">${categorie}</span>
          <h3>${titre}</h3>
          <p>${texte}</p>
          <span class="lien">En préparation</span>
        </div>`

const simulateurs = {
  slug: 'simulateurs',
  titre: 'Simulateurs',
  description: 'Simulateurs patrimoniaux gratuits : capacité d’emprunt, SCPI, gain fiscal PER, acheter ou louer, droits de succession. Calculs faits dans votre navigateur, rien n’est transmis.',
  contenu: `
    <section class="bloc">
      <div class="page-tete page-tete--centre apparait">
        <p class="surtitre">Simulateurs</p>
        <h1>Des chiffres avant les décisions</h1>
        <p>Des outils gratuits pour se faire une première idée. Les calculs se font dans votre navigateur : rien n'est transmis, rien n'est conservé.</p>
      </div>
      <div class="outils apparait apparait-2">
${outil({ href: '/simulateur-scpi.html', categorie: 'Immobilier & revenus', titre: 'SCPI', etiquettes: ['Revenus', 'Réinvestissement'],
  texte: 'Capital investi et revenus perçus, avec un versement initial et des versements programmés, dividendes distribués ou réinvestis.' })}
${outil({ href: '/simulateur-per.html', categorie: 'Retraite & fiscalité', titre: 'Gain fiscal PER', etiquettes: ["Économie d'impôt", 'Plafond 2026'],
  texte: "Économie d'impôt d'un versement déductible, dans la limite du plafond 2026, et capital constitué à la retraite." })}
${outil({ href: '/simulateur-acheter-louer.html', categorie: 'Résidence principale', titre: 'Acheter ou louer', etiquettes: ['Patrimoine', 'Année de bascule'],
  texte: "Le patrimoine du propriétaire et celui du locataire qui place son apport, comparés année après année." })}
${outil({ href: '/simulateur-capacite-emprunt.html', categorie: 'Financement', titre: "Capacité d'emprunt", etiquettes: ['Endettement à 35 %', 'Prix accessible'],
  texte: "Montant empruntable et prix du bien accessible, selon la règle des 35 % d'endettement appliquée par les banques." })}
${outil({ href: LIGNEE + 'simulateur.html', categorie: 'Transmission', titre: 'Droits de succession', etiquettes: ['Abattements', 'Assurance-vie'],
  texte: 'Droits dus par chaque héritier : abattements, barème du lien de parenté, assurance-vie avant et après 70 ans.', externe: true })}
${bientot('Immobilier & fiscalité', 'Investissement locatif', 'Rentabilité, fiscalité et effort d’épargne d’un bien mis en location.')}
      </div>
    </section>`,
}

// ---------------------------------------------------------------- Ressources
const registre = `
          <ul class="registre">
            <li><div><strong>ORIAS n° ${ARENSEIGNER.orias}</strong><span>Registre unique des intermédiaires en assurance, banque et finance — vérifiable sur <a href="https://www.orias.fr" rel="noopener">orias.fr</a>.</span></div></li>
            <li><div><strong>Mandataire d'intermédiaire d'assurance (MIA)</strong><span>Inscrit depuis le 25 septembre 2026.</span></div></li>
            <li><div><strong>Mandataire d'intermédiaire en opérations de banque et en services de paiement (MIOBSP)</strong><span>Inscrit depuis le 17 juillet 2026.</span></div></li>
            <li><div><strong>Association professionnelle</strong><span>Adhérent d'${ARENSEIGNER.associationMia.split(',')[0]}.</span></div></li>
            <li><div><strong>Autorité de contrôle</strong><span>Autorité de contrôle prudentiel et de résolution (ACPR).</span></div></li>
          </ul>`

// Partenaires en bandes qui défilent, alternativement vers la gauche et vers la
// droite. Chaque bande est écrite deux fois : l'animation glisse de la moitié
// de sa longueur et reboucle sans à-coup. Le double est masqué aux lecteurs
// d'écran, qui lisent la liste une seule fois.
const bandes = (noms, nb = 4) => {
  const rangs = Array.from({ length: nb }, (_, i) => noms.filter((_, j) => j % nb === i))
  return rangs.map((rang, i) => {
    const puces = rang.map(n => `<span>${n}</span>`).join('')
    return `
            <div class="defilant${i % 2 ? ' defilant--inverse' : ''}" style="--duree:${38 + i * 6}s">
              <div class="defilant-piste">
                <div class="logos">${puces}</div>
                <div class="logos" aria-hidden="true">${puces}</div>
              </div>
            </div>`
  }).join('')
}

const partenaires = A_COMPLETER.partenaires.length
  ? `<p style="margin-top:0">Assureurs, sociétés de gestion, promoteurs et établissements bancaires.</p>
          <div class="partenaires">${bandes(A_COMPLETER.partenaires)}
          </div>
          <p style="font-size:14px;margin-top:12px">Liste non exhaustive.</p>`
  : aCompleter('la liste des assureurs, sociétés de gestion et banques avec lesquels tu travailles réellement. Tant qu’elle est vide, cette rubrique ne s’affiche pas sur le site public.')

const fiche = (titre, corps) => `
      <div class="fiche">
        <h2>${titre}</h2>
        <div>${corps}</div>
      </div>`

const ressources = {
  slug: 'ressources',
  titre: 'Ressources',
  description: `Habilitations, statuts réglementaires et partenaires de ${NOM}, et guides pour comprendre la transmission de patrimoine.`,
  contenu: `
    <section class="bloc">
      <div class="page-tete apparait">
        <p class="surtitre">Ressources</p>
        <h1>Tout ce qui encadre mon activité</h1>
        <p>Statuts, inscriptions et partenaires : des informations publiques, vérifiables en un clic.</p>
      </div>
${fiche('Habilitations', registre)}
${A_COMPLETER.partenaires.length || !PUBLIQUE ? fiche('Partenaires', partenaires) : ''}
${fiche('Guides', `
          <a class="contact" href="${LIGNEE}" rel="noopener" style="max-width:560px">
            <div class="icone">${ICONES.guide}</div>
            <div><small>Lignée</small><strong>Comprendre la succession</strong><span>Abattements, donation, assurance-vie, démembrement, PER, prêt familial : les règles expliquées simplement.</span></div>
          </a>`)}
    </section>`,
}

// ---------------------------------------------------------------- À propos
const parcours = A_COMPLETER.parcours.length
  ? A_COMPLETER.parcours.map(p => `<p>${p}</p>`).join('\n          ')
  : aCompleter('ton parcours en deux ou trois paragraphes : d’où tu viens, ce qui t’a amené au conseil patrimonial, ce que tu en retiens.')

const initiales = NOM.split(' ').map(m => m[0].toLowerCase()).join('')

const aPropos = {
  slug: 'a-propos',
  titre: 'À propos',
  description: `Parcours, méthode et cadre d'exercice de ${NOM}, ${METIER.toLowerCase()}.`,
  contenu: `
    <section class="bloc">
      <div class="page-tete apparait">
        <div class="profil">
          <div class="profil-photo${A_COMPLETER.photo ? ' avec-photo' : ''}">${A_COMPLETER.photo ? `<img src="${A_COMPLETER.photo}" alt="Portrait de ${NOM}" />` : initiales}</div>
          <div><p class="surtitre" style="margin:0">À propos</p><h1 style="margin:4px 0 0">${NOM}</h1></div>
        </div>
        <p>${METIER}</p>
      </div>
${fiche('Parcours', parcours)}
${fiche('Philosophie de conseil', `
          <p>Tout commence par un audit patrimonial offert : un premier rendez-vous pour dresser le relevé complet de votre situation — revenus, charges, patrimoine, projets. À partir de ce bilan, je prépare des préconisations adaptées à votre cas, que je vous présente lors d'un second rendez-vous. Jamais une solution toute faite.</p>
          <p>Je travaille en architecture ouverte : je ne dépends ni d'un seul assureur ni d'un seul produit, ce qui me laisse libre de retenir ce qui vous convient vraiment.</p>
          <p>Cette liberté va de pair avec la pédagogie : je vous explique avant de vous recommander, pour que chaque décision soit comprise, et pas seulement acceptée.</p>`)}
${fiche("Cadre d'exercice", `
          <p>Inscrit au registre de l'ORIAS sous le numéro ${ARENSEIGNER.orias}, en qualité de mandataire d'intermédiaire d'assurance et de mandataire d'intermédiaire en opérations de banque et en services de paiement, sous le contrôle de l'Autorité de contrôle prudentiel et de résolution.</p>
          <p>Toute recommandation personnalisée est précédée de la remise d'un document d'entrée en relation, et formalisée par écrit.</p>
          <p><a class="btn btn--contour" href="/ressources.html">Voir les habilitations</a></p>`)}
    </section>`,
}

// ---------------------------------------------------------------- Rendez-vous
const sujet = encodeURIComponent('Demande de rendez-vous')
// Réservation : un lien vers la page Google Agenda de Kevin, et non un
// calendrier intégré, pour que le site reste sans cookie ni traceur.
const RESERVATION = A_COMPLETER.reservation
if (RESERVATION && !/^https:\/\/(calendar\.app\.google\/|calendar\.google\.com\/calendar\/appointments\/)/.test(RESERVATION)) {
  throw new Error(`Lien de réservation inattendu : ${RESERVATION} (attendu : la page de réservation de Google Agenda)`)
}
// Trois façons d'échanger, en grandes cartes sombres : la réservation en
// ligne d'abord (si le lien est renseigné), puis le téléphone et le courriel.
const format = ({ href, icone, categorie, titre, duree = '', detail, texte, action, externe = false }) => `
        <a class="format" href="${href}"${externe ? ' target="_blank" rel="noopener"' : ''}>
          <span class="format-icone">${ICONES[icone]}</span>
          <span class="categorie">${categorie}</span>
          <h3>${titre}</h3>
          <span class="format-detail">${duree ? `<span class="format-duree">${ICONES.horloge}${duree}</span>` : ''}${detail}</span>
          <p>${texte}</p>
          <span class="lien">${action}<span aria-hidden="true">→</span></span>
        </a>`
const formats = [
  RESERVATION && format({ href: RESERVATION, icone: 'agenda', categorie: 'Réservation en ligne', titre: 'Audit patrimonial',
    duree: '1 h 15', detail: 'Offert', externe: true, action: 'Choisir un créneau',
    texte: 'Un premier rendez-vous pour faire le relevé complet de votre situation et de vos projets. Choisissez directement un créneau libre dans mon agenda.' }),
  format({ href: `tel:${CONTACT.telephoneLien}`, icone: 'telephone', categorie: 'Par téléphone', titre: 'Un appel',
    duree: '30 minutes', detail: CONTACT.telephone, action: 'Appeler',
    texte: 'Pour une première question ou un échange rapide. Si je suis en rendez-vous, laissez un message : je vous rappelle.' }),
  format({ href: `mailto:${CONTACT.courriel}?subject=${sujet}`, icone: 'courriel', categorie: 'Par courriel', titre: 'Un message',
    detail: CONTACT.courriel, action: 'Écrire',
    texte: "Indiquez vos disponibilités et l'objet de votre demande : je reviens vers vous pour fixer le rendez-vous." }),
].filter(Boolean).join('')

const rendezVous = {
  slug: 'rendez-vous',
  titre: 'Prendre rendez-vous',
  description: `Prendre rendez-vous avec ${NOM}${RESERVATION ? ' : réservation en ligne d’un audit patrimonial offert,' : ''} par téléphone ou par courriel.`,
  contenu: `
    <section class="bloc">
      <div class="page-tete page-tete--centre apparait">
        <p class="surtitre">Rendez-vous</p>
        <h1>Faisons le point ensemble</h1>
        <p>Choisissez la façon d'échanger qui vous convient le mieux.</p>
      </div>
      <div class="formats apparait apparait-2">${formats}
      </div>
      ${RESERVATION ? `<p class="formats-note apparait apparait-3">Les rendez-vous réservés en ligne s'inscrivent directement dans mon agenda ; la confirmation vous arrive aussitôt par courriel.</p>` : aCompleter('le lien de ta page de réservation Google Agenda (champ « reservation » de contenu/a-completer.mjs).')}
${fiche("Pour préparer l'échange", `
          <p>Rien n'est obligatoire, mais ces documents permettent d'aller plus loin dès le premier rendez-vous :</p>
          <ul class="liste-coche">
            <li>votre dernier avis d'impôt sur le revenu ;</li>
            <li>les relevés de vos contrats d'épargne (assurance-vie, PER, livrets) ;</li>
            <li>les tableaux d'amortissement de vos crédits en cours ;</li>
            <li>une idée de vos projets : achat, retraite, transmission, revenus complémentaires.</li>
          </ul>
          <p class="note">${RESERVATION
            ? "Ce site ne comporte aucun formulaire. La réservation en ligne se fait sur la page de réservation de Google Agenda : le nom et l'adresse électronique que vous y indiquez servent uniquement à organiser le rendez-vous."
            : 'Ce site ne comporte aucun formulaire : vos informations ne transitent que par votre propre messagerie ou votre téléphone.'}</p>`)}
    </section>`,
}

// ---------------------------------------------------------------- Mentions légales
const mentions = {
  slug: 'mentions-legales',
  titre: 'Mentions légales et confidentialité',
  description: `Éditeur, statuts réglementaires, hébergeur et politique de confidentialité du site de ${NOM}.`,
  contenu: `
    <section class="bloc">
      <div class="page-tete">
        <p class="surtitre">Informations légales</p>
        <h1>Mentions légales</h1>
        <p>En application de l'article 6-III-1 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.</p>
      </div>
      <div class="texte">

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
      </p>${RESERVATION ? `
      <p>
        <strong>Prise de rendez-vous.</strong> Le bouton « Voir les créneaux » ouvre la page
        de réservation de Google Agenda, en dehors de ce site. Les informations que vous y
        saisissez (nom, adresse électronique, éventuel message) sont transmises à Google et
        à ${NOM} pour fixer et confirmer le rendez-vous, et ne servent à rien d'autre. Elles
        sont soumises aux règles de confidentialité de Google.
      </p>` : ''}

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
      </div>
    </section>`,
}

// ---------------------------------------------------------------- Pages de simulateur
const pageSimu = ({ slug, titre, description, script, surtitre, intro }) => ({
  slug, titre, description, script,
  contenu: `
    <section class="bloc">
      <p class="fil fil--centre"><a href="/simulateurs.html">Simulateurs</a> / ${titre}</p>
      <div class="page-tete page-tete--centre page-tete--simu">
        <p class="surtitre">${surtitre}</p>
        <h1>${titre}</h1>
        <p>${intro}</p>
      </div>
      <div id="app"></div>
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
const simuCapacite = pageSimu({
  slug: 'simulateur-capacite-emprunt', titre: "Capacité d'emprunt", script: '/src/simulateurs/capacite.tsx',
  surtitre: 'Financement',
  description: "Calculez votre capacité d'emprunt immobilier : mensualité maximale à 35 % d'endettement, montant empruntable et prix du bien accessible. Règles 2026.",
  intro: "Combien pouvez-vous emprunter, et pour quel prix de bien ? Le calcul suit la règle des 35 % d'endettement appliquée par les banques.",
})
const simuAchat = pageSimu({
  slug: 'simulateur-acheter-louer', titre: 'Acheter ou louer', script: '/src/simulateurs/acheter-louer.tsx',
  surtitre: 'Résidence principale',
  description: 'Acheter ou louer sa résidence principale ? Comparez année après année le patrimoine du propriétaire et celui du locataire qui place son apport.',
  intro: "À budget égal, qui s'enrichit le plus : le propriétaire qui rembourse son crédit, ou le locataire qui place son apport et la différence ?",
})

export const pages = [accueil, simulateurs, ressources, aPropos, rendezVous, mentions, simuScpi, simuPer, simuAchat, simuCapacite]
