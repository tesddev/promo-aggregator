'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Promotion, PaginatedResponse, Brand } from '@promo/shared';
import PromoCard from './components/PromoCard';
import BrandGroup from './components/BrandGroup';

const API = 'http://localhost:4000';

export default function Home() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [groupByBrand, setGroupByBrand] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: '20', ...(search && { search }) });
    const res = await fetch(`${API}/promotions?${params}`);
    const data: PaginatedResponse<Promotion> = await res.json();
    setPromos(data.data);
    setTotal(data.total);
    setLoading(false);
  }, [page, search]);

  const fetchBrands = useCallback(async () => {
    const res = await fetch(`${API}/brands`);
    setBrands(await res.json());
  }, []);

  useEffect(() => { fetchPromos(); }, [fetchPromos]);
  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const totalPages = Math.ceil(total / 20);

  const grouped = brands.map(b => ({
    brand: b,
    promos: promos.filter(p => p.brandId === b.id)
  })).filter(g => g.promos.length > 0);

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Promotions</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="Search promos or brands..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14 }}
        />
        <button
          onClick={() => setGroupByBrand(g => !g)}
          style={{ padding: '8px 16px', background: groupByBrand ? '#1e293b' : '#f1f5f9', color: groupByBrand ? '#fff' : '#1e293b', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}
        >
          {groupByBrand ? 'Flat View' : 'Group by Brand'}
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && groupByBrand ? (
        grouped.map(({ brand, promos: bp }) => (
          <BrandGroup key={brand.id} brand={brand as any} promos={bp} />
        ))
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {promos.map(p => <PromoCard key={p.id} promo={p} />)}
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 32 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
              <span style={{ padding: '4px 12px' }}>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
            </div>
          )}
        </>
      )}
    </main>
  );
}