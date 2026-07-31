export const STYLES = [
  { id: 'manga', name: 'Manga', emoji: '📖', color: '#fbbf24', desc: 'Trait noir, yeux lumineux, ambiance shonen', bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
  { id: 'comics', name: 'Comics', emoji: '💥', color: '#ff6b35', desc: 'Pop, couleurs vives, halftones', bg: 'linear-gradient(135deg, #ff6b35, #ef4444)' },
  { id: 'cartoon', name: 'Cartoon', emoji: '🎨', color: '#ec4899', desc: 'Déformé, expressif, fun', bg: 'linear-gradient(135deg, #ec4899, #d946ef)' },
  { id: 'pop-art', name: 'Pop Art', emoji: '🎭', color: '#06b6d4', desc: 'Warhol style, couleurs contrastées', bg: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { id: 'sketch', name: 'Sketch', emoji: '✏️', color: '#7c3aed', desc: 'Trait crayonné, effet dessin', bg: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
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

export const PRODUCTS = [
  { id: 'tee', name: 'T-shirt coton local', type: 'tee', price: 10000, unit: 'FCFA', desc: 'Coton 100% local, coupe classique. Ton toon imprimé devant.' },
  { id: 'polo', name: 'Polo coton local', type: 'polo', price: 15000, unit: 'FCFA', desc: 'Coton local, col polo. Ton toon brodé sur la poitrine.' },
]

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

export function getStyle(id) {
  return STYLES.find((s) => s.id === id) || STYLES[0]
}

export function getStatus(id) {
  return ORDER_STATUSES.find((s) => s.id === id) || ORDER_STATUSES[0]
}
