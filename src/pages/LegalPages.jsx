import { Link } from 'react-router-dom'

const CONTENT = {
  cgv: {
    title: 'Conditions Générales de Vente',
    sections: [
      ['1. Objet', 'MyToon (OULAI Siéni, Abidjan, Côte d\'Ivoire) vend des t-shirts (10 000 FCFA) et polos (15 000 FCFA) 100 % coton local, personnalisés avec un toon créé à partir de la photo envoyée par le client. Les présentes CGV régissent toute commande passée sur ce site.'],
      ['2. Commande & création', 'Après confirmation, le client reçoit un numéro de suivi MT-XXXX. Nos artistes créent 3 déclinaisons de toon en 1h chrono. Le client choisit sa déclinaison préférée avant impression.'],
      ['3. Prix & paiement', 'Paiement à la livraison : Wave, Orange Money, MTN MoMo ou espèces. Les remises éventuelles (codes promo) sont appliquées au moment de la passation de commande.'],
      ['4. Délais', 'Création du toon : 1 heure. Impression + livraison : 24-48h après validation de la déclinaison, sur Abidjan.'],
      ['5. Photo du client', 'La photo envoyée sert uniquement à la création du toon. Elle est stockée de façon sécurisée et n\'est jamais revendue.'],
      ['6. Annulation & remboursement', 'Une commande peut être annulée tant qu\'aucune impression n\'a débuté. Après impression, aucun remboursement n\'est possible sauf défaut de fabrication (remplacement).'],
    ],
  },
  confidentialite: {
    title: 'Politique de Confidentialité',
    sections: [
      ['1. Données collectées', 'Nom, téléphone, adresse de livraison, photo, et détails de commande. Seules les données strictement nécessaires à la commande et à la livraison sont collectées.'],
      ['2. Utilisation', 'Vos données servent à traiter la commande, créer votre toon, assurer la livraison et le suivi. Aucune donnée n\'est vendue ni partagée avec des tiers, hors imprimeur partenaire strictement pour la fabrication.'],
      ['3. Sécurité', 'Les photos et données de commande sont protégées par le contrôle d\'accès de la base de données (accès restreint). Les images personnelles ne sont jamais exposées publiquement.'],
      ['4. Durée de conservation', 'Les données sont conservées le temps nécessaire au traitement de la commande et à son historique client, puis supprimées à votre demande.'],
      ['5. Vos droits', 'Vous pouvez demander la consultation, la correction ou la suppression de vos données en nous contactant (voir Contact).'],
    ],
  },
  livraison: {
    title: 'Livraison & Retours',
    sections: [
      ['1. Zone de livraison', 'Livraison à Abidjan (Côte d\'Ivoire) sous 24-48h après validation de votre déclinaison, du lundi au samedi.'],
      ['2. Frais', 'La livraison est gratuite sur Abidjan pour toute commande. Le paiement s\'effectue à la réception.'],
      ['3. Suivi', 'Vous suivez votre commande à tout moment via votre numéro MT-XXXX sur la page Suivi.'],
      ['4. Retours', 'En cas de défaut de fabrication (impression, couture, taille erronée), la commande est remplacée gratuitement sous 7 jours. Aucun retour pour changement d\'avis après impression.'],
      ['5. Contact', 'Pour toute question : +225 07 16 53 55 80 ou WhatsApp +225 05 45 29 82 80.'],
    ],
  },
}

export default function LegalPage({ type }) {
  const content = CONTENT[type] || CONTENT.cgv
  return (
    <div className="container" style={wrapStyle}>
      <header style={headerStyle}>
        <h1 className="section-title" style={titleStyle}>{content.title}</h1>
        <p style={subStyle}>Dernière mise à jour : août 2026</p>
      </header>
      <div style={bodyStyle}>
        {content.sections.map(([heading, body]) => (
          <div key={heading} style={sectionStyle}>
            <h2 style={hStyle}>{heading}</h2>
            <p style={pStyle}>{body}</p>
          </div>
        ))}
      </div>
      <div style={ctaStyle}>
        <Link to="/" className="btn btn-primary" style={{ padding: '12px 28px' }}>Retour à l'accueil</Link>
      </div>
    </div>
  )
}

const wrapStyle = { padding: '96px 24px 80px', maxWidth: '820px', margin: '0 auto' }

const headerStyle = { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px' }

const titleStyle = { fontSize: '38px', color: 'var(--white)' }

const subStyle = { fontSize: '13px', color: 'var(--gray-500)' }

const bodyStyle = { display: 'flex', flexDirection: 'column', gap: '28px' }

const sectionStyle = { display: 'flex', flexDirection: 'column', gap: '8px' }

const hStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', color: 'var(--orange)' }

const pStyle = { fontSize: '15px', color: 'var(--gray-400)', lineHeight: 1.7 }

const ctaStyle = { display: 'flex', justifyContent: 'center', marginTop: '48px' }