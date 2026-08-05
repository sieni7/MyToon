export const STYLES = [
  {
    id: 'manga', name: 'Manga', emoji: '📖', color: '#fbbf24',
    desc: 'Trait noir, yeux lumineux, ambiance shonen',
    bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    details: 'Style anime japonais : grands yeux expressifs, lignes de contour nettes et ombrage cel shading. L\'ambiance shonen pour des poses dynamiques et énergiques.',
    particularites: ['Grands yeux lumineux', 'Contours nets', 'Ombrage cel shading', 'Cheveux détaillés'],
    origine: 'Héritage du manga japonais (inspiration shonen)',
    date: 'Créé en juillet 2026',
  },
  {
    id: 'comics', name: 'Comics', emoji: '💥', color: '#ff6b35',
    desc: 'Pop, couleurs vives, halftones',
    bg: 'linear-gradient(135deg, #ff6b35, #ef4444)',
    details: 'Style comic book américain : lignes d\'encre épaisses, ombrage halftone et éclairage dramatique. Le look des super-héros classiques.',
    particularites: ['Encrage épais', 'Ombrage halftone', 'Couleurs vibrantes', 'Contrastes forts'],
    origine: 'Comics américains (Marvel / DC)',
    date: 'Créé en juillet 2026',
  },
  {
    id: 'cartoon', name: 'Cartoon', emoji: '🎨', color: '#ec4899',
    desc: 'Déformé, expressif, fun',
    bg: 'linear-gradient(135deg, #ec4899, #d946ef)',
    details: 'Style cartoon : proportions exagérées, expressions fun et énergie débordante. Le rendu dessin animé classique.',
    particularites: ['Expressions exagérées', 'Proportions stylisées', 'Couleurs vives', 'Vibe dessin animé'],
    origine: 'Cartoons d\'animation occidentaux',
    date: 'Bientôt disponible',
  },
  {
    id: 'pop-art', name: 'Pop Art', emoji: '🎭', color: '#06b6d4',
    desc: 'Warhol style, couleurs contrastées',
    bg: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    details: 'Style Pop Art rétro : couleurs flashys et saturées, contours noirs prononcés, arrière-plan graphique. L\'esprit d\'Andy Warhol et Roy Lichtenstein.',
    particularites: ['Couleurs saturées', 'Contours noirs', 'Fond géométrique', 'Vibe galerie d\'art'],
    origine: 'Mouvement Pop Art (Warhol, Lichtenstein)',
    date: 'Créé en juillet 2026',
  },
  {
    id: 'sketch', name: 'Sketch', emoji: '✏️', color: '#7c3aed',
    desc: 'Trait crayonné, effet dessin',
    bg: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    details: 'Style sketch : trait crayonné, effet dessin à la main. Le rendu d\'une illustration originale.',
    particularites: ['Trait crayonné', 'Effet dessiné', 'Ambiance croquis', 'Style illustration'],
    origine: 'Illustration traditionnelle / BD franco-belge',
    date: 'Bientôt disponible',
  },
]

export const AVATARS = [
  { id: 'manga-01', style: 'manga', image: '/avatars/avatar-manga-01.jpg', name: 'Toon Manga 01', enabled: true },
  { id: 'manga-02', style: 'manga', image: '/avatars/avatar-manga-02.jpg', name: 'Toon Manga 02', enabled: false },
  { id: 'comics-01', style: 'comics', image: '/avatars/avatar-comics-01.jpg', name: 'Toon Comics 01', enabled: true },
  { id: 'comics-02', style: 'comics', image: '/avatars/avatar-comics-02.jpg', name: 'Toon Comics 02', enabled: false },
  { id: 'cartoon-01', style: 'cartoon', image: '/avatars/avatar-cartoon-01.jpg', name: 'Toon Cartoon 01', enabled: false },
  { id: 'cartoon-02', style: 'cartoon', image: '/avatars/avatar-cartoon-02.jpg', name: 'Toon Cartoon 02', enabled: false },
  { id: 'popart-01', style: 'pop-art', image: '/avatars/avatar-popart-01.jpg', name: 'Toon Pop Art 01', enabled: true },
  { id: 'popart-02', style: 'pop-art', image: '/avatars/avatar-popart-02.jpg', name: 'Toon Pop Art 02', enabled: false },
  { id: 'sketch-01', style: 'sketch', image: '/avatars/avatar-sketch-01.jpg', name: 'Toon Sketch 01', enabled: false },
  { id: 'sketch-02', style: 'sketch', image: '/avatars/avatar-sketch-02.jpg', name: 'Toon Sketch 02', enabled: false },
]

export const REFERENCE_PHOTO = '/reference-originale.jpg'

export const ACTIVE_AVATARS = AVATARS.filter((a) => a.enabled)

export const ACTIVE_STYLES = STYLES.filter((s) => ACTIVE_AVATARS.some((a) => a.style === s.id))

export const GALLERY_STYLES = STYLES.map((s) => ({
  ...s,
  enabled: ACTIVE_AVATARS.some((a) => a.style === s.id),
  avatar: ACTIVE_AVATARS.find((a) => a.style === s.id) || null,
})).sort((a, b) => Number(b.enabled) - Number(a.enabled))

export const PRODUCTS = [
  { id: 'tee', name: 'T-shirt coton local', type: 'tee', price: 10000, unit: 'FCFA', desc: 'Coton 100% local, coupe classique. Ton toon imprimé devant.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Blanc', 'Noir'] },
  { id: 'polo', name: 'Polo coton local', type: 'polo', price: 15000, unit: 'FCFA', desc: 'Coton local, col polo. Ton toon brodé sur la poitrine.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Blanc', 'Noir'] },
]

export const SIZE_GUIDE = {
  S: { tour: '88-96 cm', note: 'Enfants 12-14 ans / silhouette fine' },
  M: { tour: '96-104 cm', note: 'Référence homme/adulte' },
  L: { tour: '104-112 cm', note: 'Silhouette large' },
  XL: { tour: '112-120 cm', note: 'Grande silhouette' },
  XXL: { tour: '120-128 cm', note: 'Très grande silhouette' },
}

export const ORDER_STATUSES = [
  { id: 'recue', label: 'Commande reçue', icon: '📩', desc: 'Nous avons bien reçu ta commande. Préparation de la création.' },
  { id: 'en_creation', label: 'Création du toon', icon: '🎨', desc: 'Ton toon est en cours de création : 3 déclinaisons du style choisi en 1 heure chrono.' },
  { id: 'propositions_pretes', label: '3 propositions prêtes', icon: '✨', desc: 'Tes 3 déclinaisons sont prêtes. Choisis celle que tu préfères.' },
  { id: 'validation_attente', label: 'En attente de ta validation', icon: '⏳', desc: 'Confirme ta déclinaison pour lancer l\'impression.' },
  { id: 'validee', label: 'Validée', icon: '✅', desc: 'Déclinaison validée. Attribution à l\'imprimeur partenaire.' },
  { id: 'en_impression', label: 'En impression', icon: '🖨️', desc: 'Impression en cours. Livraison sous 24-48h.' },
  { id: 'expediee', label: 'Expédiée', icon: '🚚', desc: 'Ton tee-shirt est en route vers ton adresse.' },
  { id: 'livree', label: 'Livrée', icon: '📦', desc: 'Commande livrée. Profite de ton héros !' },
]

export const PHASES = [
  {
    num: '1', name: 'Le Choix', icon: '🦸',
    steps: ['Avatar', 'Support'],
    desc: 'Choisis ton style toon et ton support (T-shirt 10 000 F ou Polo 15 000 F).',
  },
  {
    num: '2', name: 'L\'Incarnation', icon: '⚡',
    steps: ['Photo', '1h chrono', '3 déclinaisons'],
    desc: 'Envoie ta photo. Nos artistes créent 3 déclinaisons de ton toon en 1 heure.',
  },
  {
    num: '3', name: 'La Concrétisation', icon: '👕',
    steps: ['Validation', 'Impression', '24-48h'],
    desc: 'Tu valides ta préférée. Impression et livraison en 24-48h, suivi en temps réel.',
  },
]

export const TESTIMONIALS = [
  { name: 'Mariam B.', quartier: 'Cocody', text: '3 propositions en 1 heure, j\'ai choisi ma préférée et reçu mon t-shirt 2 jours après. Incroyable.', rating: 5 },
  { name: 'Arnaud K.', quartier: 'Yopougon', text: 'Mon toon Manga est exactement comme je l\'imaginais. Les 3 déclinaisons c\'est top pour choisir.', rating: 5 },
  { name: 'Fatou S.', quartier: 'Plateau', text: 'J\'ai suivi ma commande de A à Z sur l\'app. Le polo est magnifique.', rating: 5 },
  { name: 'Jean-Paul T.', quartier: 'Treichville', text: 'Style Comics, livré en 48h après validation. Mes potes veulent tous le même.', rating: 5 },
]

export const FAQ = [
  { q: 'Comment ça fonctionne ?', a: 'Tu choisis un style toon, tu envoies ta photo et tu commandes. Nos artistes te préparent 3 déclinaisons de ton toon en 1 heure. Tu valides ta préférée, puis c\'est imprimé et livré en 24-48h.' },
  { q: 'Quels sont les délais ?', a: 'Création du toon : 1 heure chrono. Impression + livraison : 24-48h à partir de la validation de ta déclinaison.' },
  { q: 'Quels sont les prix ?', a: 'T-shirt coton local : 10 000 FCFA. Polo coton local : 15 000 FCFA. La création du toon est incluse.' },
  { q: 'Comment payer ?', a: 'Wave, Orange Money et Mobile Money. Paiement 100% sécurisé.' },
  { q: 'Puis-je suivre ma commande ?', a: 'Oui. Tu reçois un numéro de suivi (ex: MT-0001) que tu peux consulter à tout moment sur la page Suivi pour voir l\'évolution de ta commande.' },
]

export const ADMIN_PASSCODE = 'mytoon2026'

export function formatPrice(price) {
  return `${Number(price).toLocaleString('fr-FR')} FCFA`
}

export function priceWithPromo(price, promo) {
  const discount = promo && Number(promo.discount) ? Number(promo.discount) : 0
  return Math.round(Number(price) * (1 - discount / 100))
}

export function getStyle(id) {
  return STYLES.find((s) => s.id === id) || STYLES[0]
}

export function getStatus(id) {
  return ORDER_STATUSES.find((s) => s.id === id) || ORDER_STATUSES[0]
}
