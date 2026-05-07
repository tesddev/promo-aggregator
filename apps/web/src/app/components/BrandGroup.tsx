import type { Brand, Promotion } from '@promo/shared';
import PromoCard from './PromoCard';

export default function BrandGroup({ brand, promos }: { brand: Brand; promos: Promotion[] }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>{brand.name}</h2>
        <span style={{ fontSize: 12, color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: 12 }}>
          {promos.length} {promos.length === 1 ? 'Promotion' : 'Promotions'}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {promos.map(p => <PromoCard key={p.id} promo={p} />)}
      </div>
    </div>
  );
}
