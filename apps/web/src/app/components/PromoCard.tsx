import type { Promotion } from '@promo/shared';

export default function PromoCard({ promo }: { promo: Promotion }) {
    return (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
            {promo.imageUrl && <img src={promo.imageUrl} alt={promo.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
            <div style={{ padding: 16 }}>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{promo.brandName ?? 'Unknown Brand'}</p>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{promo.name}</h3>
                {promo.endDate && <p style={{ fontSize: 12, color: '#ef4444' }}>Ends {promo.endDate}</p>}
                <a href={promo.canonicalUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: '#2563eb' }}>
                    View Deal →
                </a>
            </div>
        </div>
    );
}