import type { Brand, Promotion } from '@promo/shared';
import PromoCard from './PromoCard';

interface Props {
  brand: Brand & { promotionCount: number };
  promos: Promotion[];
}

export default function BrandGroup({ brand, promos }: Props) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ borderBottom: '2px solid #1e293b', paddingBottom: 12, marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>{brand.name}</h2>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b', marginTop: 4, flexWrap: 'wrap' }}>
          {brand.websiteUrl && <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer">Website</a>}
          {brand.hours && <span>🕐 {brand.hours}</span>}
          {brand.socialLinks.instagram && <a href={brand.socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
          {brand.socialLinks.facebook && <a href={brand.socialLinks.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {promos.map(p => <PromoCard key={p.id} promo={p} />)}
      </div>
    </div>
  );
}