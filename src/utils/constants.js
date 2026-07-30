export const STYLES = [
  { id: 'manga', name: 'Manga', emoji: '📖', color: '#fbbf24', desc: 'Trait noir, yeux lumineux, ambiance shonen', bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
  { id: 'comics', name: 'Comics', emoji: '💥', color: '#ff6b35', desc: 'Pop, couleurs vives, halftones', bg: 'linear-gradient(135deg, #ff6b35, #ef4444)' },
  { id: 'cartoon', name: 'Cartoon', emoji: '🎨', color: '#ec4899', desc: 'Déformé, expressif, fun', bg: 'linear-gradient(135deg, #ec4899, #d946ef)' },
  { id: 'pop-art', name: 'Pop Art', emoji: '🎭', color: '#06b6d4', desc: 'Warhol style, couleurs contrastées', bg: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { id: 'sketch', name: 'Sketch', emoji: '✏️', color: '#7c3aed', desc: 'Trait crayonné, effet dessin', bg: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
]

export const CAROUSEL_AVATARS = [
  { id: 1, style: 'Manga', name: 'Kevin A.', color: '#fbbf24', emoji: '📖' },
  { id: 2, style: 'Comics', name: 'Mariam B.', color: '#ff6b35', emoji: '💥' },
  { id: 3, style: 'Cartoon', name: 'Arnaud K.', color: '#ec4899', emoji: '🎨' },
  { id: 4, style: 'Pop Art', name: 'Fatou S.', color: '#06b6d4', emoji: '🎭' },
  { id: 5, style: 'Sketch', name: 'Jean-Paul T.', color: '#7c3aed', emoji: '✏️' },
]

export const PRODUCTS = [
  { id: 'tee-black', name: 'T-shirt noir', type: 'tee', color: '#0a0a0a', price: '29 000' },
  { id: 'tee-white', name: 'T-shirt blanc', type: 'tee', color: '#ffffff', price: '29 000' },
  { id: 'hoodie-black', name: 'Hoodie noir', type: 'hoodie', color: '#171717', price: '45 000' },
  { id: 'hoodie-gray', name: 'Hoodie gris', type: 'hoodie', color: '#525252', price: '45 000' },
  { id: 'cap-black', name: 'Casquette noire', type: 'cap', color: '#0a0a0a', price: '15 000' },
  { id: 'tote-black', name: 'Tote bag noir', type: 'tote', color: '#0a0a0a', price: '12 000' },
]

export const PHASES = [
  {
    num: '1', name: 'L\'Éveil', icon: '⚡',
    steps: ['Photo', 'Style'],
    desc: 'Choisis ton image et l\'univers qui te ressemble',
  },
  {
    num: '2', name: 'L\'Incarnation', icon: '🦸',
    steps: ['IA', 'Avatar', 'Comparer'],
    desc: 'Notre IA te transforme en héros sous tes yeux',
  },
  {
    num: '3', name: 'La Concrétisation', icon: '👕',
    steps: ['T-shirt', 'Panier', 'Recevoir'],
    desc: 'Porte ton alter ego dans le monde réel',
  },
]

export const TESTIMONIALS = [
  { name: 'Mariam B.', quartier: 'Cocody', text: 'J\'ai offert un hoodie MyToon à mon frère. Il pleurait. Vraiment.', rating: 5 },
  { name: 'Arnaud K.', quartier: 'Yopougon', text: 'Je me suis vu en héros Manga. Je ne me reconnaissais pas... en mieux !', rating: 5 },
  { name: 'Fatou S.', quartier: 'Plateau', text: 'Ma photo sur un t-shirt en 7 jours. Le rendu est incroyable.', rating: 5 },
  { name: 'Jean-Paul T.', quartier: 'Treichville', text: 'Style Comics, mon visage sur un hoodie. Mes potes veulent tous le même.', rating: 5 },
]

export const FAQ = [
  { q: 'Comment fonctionne l\'IA ?', a: 'Tu télécharges ta photo, tu choisis un style (Manga, Comics...), notre IA transforme ton visage en avatar toon en quelques secondes.' },
  { q: 'Quels sont les délais de livraison ?', a: '7 jours ouvrés après validation de ta commande. Livraison partout en Côte d\'Ivoire.' },
  { q: 'Puis-je commander sans photo ?', a: 'Pour l\'instant oui, mais le résultat sera basé sur une photo générique. Le vrai pouvoir MyToon opère avec TA photo.' },
  { q: 'Comment payer ?', a: 'Wave, Orange Money, Mobile Money, et carte bancaire. Paiement 100% sécurisé.' },
]
