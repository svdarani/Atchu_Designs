import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import ProductCard from './ProductCard';
import FilterDrawer from './FilterDrawer';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';

export default function ShopView({ onSelectProduct, initialCategory = 'all' }) {
  const { t, isTamil } = useLanguage();
  const { products, searchQuery, setSearchQuery } = useShop();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedWorkType, setSelectedWorkType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Clear filters
  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedWorkType('all');
    setPriceRange('all');
    setSearchQuery('');
  };

  // Filter & Search Logic (Bilingual search support)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Work type filter
      if (selectedWorkType !== 'all' && p.workType !== selectedWorkType) {
        return false;
      }

      // Price filter
      if (priceRange === 'under2500' && p.startingPrice >= 2500) return false;
      if (priceRange === '2500to4000' && (p.startingPrice < 2500 || p.startingPrice > 4000)) return false;
      if (priceRange === 'above4000' && p.startingPrice <= 4000) return false;

      // Search query (matches English or Tamil names and descriptions)
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchEn = p.name_en.toLowerCase().includes(q) || p.description_en.toLowerCase().includes(q) || p.workType_en.toLowerCase().includes(q);
        const matchTa = p.name_ta.toLowerCase().includes(q) || p.description_ta.toLowerCase().includes(q) || p.workType_ta.toLowerCase().includes(q);
        if (!matchEn && !matchTa) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.startingPrice - b.startingPrice;
      if (sortBy === 'priceDesc') return b.startingPrice - a.startingPrice;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      return b.rating - a.rating; // default popular
    });
  }, [products, selectedCategory, selectedWorkType, priceRange, searchQuery, sortBy]);

  return (
    <div className="container section-padding">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
          {t('shop.title')}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '640px', margin: '0 auto' }}>
          {t('shop.subtitle')}
        </p>
      </div>

      {/* Control Bar (Filters button on mobile, Results Count, Sort Dropdown) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-24)', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="btn btn-sm btn-outline d-md-none"
            style={{ gap: '6px' }}
          >
            <Filter size={15} />
            <span>{t('shop.filters')}</span>
          </button>
          <span style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {t('shop.resultsCount', { count: filteredProducts.length })}
          </span>
        </div>

        {/* Sort selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{t('shop.sortBy')}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-styled"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.84rem' }}
          >
            <option value="popular">{t('shop.popular')}</option>
            <option value="priceAsc">{t('shop.priceAsc')}</option>
            <option value="priceDesc">{t('shop.priceDesc')}</option>
            <option value="newest">{t('shop.newest')}</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout: Filters Sidebar + Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 'var(--space-32)', alignItems: 'start' }}>
        {/* Left Sidebar Filter */}
        <div className="d-none d-md-block">
          <FilterDrawer
            isOpen={true}
            onClose={() => {}}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedWorkType={selectedWorkType}
            onSelectWorkType={setSelectedWorkType}
            priceRange={priceRange}
            onSelectPriceRange={setPriceRange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Right Grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="card-premium" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
                {t('shop.noProducts')}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                {isTamil ? 'வடிகட்டிகளை மாற்றி அல்லது நீக்கி மீண்டும் முயற்சி செய்யவும்.' : 'Try adjusting your filters or clearing search query.'}
              </p>
              <button onClick={handleClearFilters} className="btn btn-outline">
                {t('shop.clearAll')}
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={onSelectProduct}
                  onQuickCustomize={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {filterDrawerOpen && (
        <div className="admin-modal-backdrop" onClick={() => setFilterDrawerOpen(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '360px', maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-body" style={{ padding: 16 }}>
              <FilterDrawer
                isOpen={true}
                onClose={() => setFilterDrawerOpen(false)}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => { setSelectedCategory(cat); setFilterDrawerOpen(false); }}
                selectedWorkType={selectedWorkType}
                onSelectWorkType={(wt) => { setSelectedWorkType(wt); setFilterDrawerOpen(false); }}
                priceRange={priceRange}
                onSelectPriceRange={(pr) => { setPriceRange(pr); setFilterDrawerOpen(false); }}
                onClearFilters={() => { handleClearFilters(); setFilterDrawerOpen(false); }}
              />
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setFilterDrawerOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                {t('shop.applyFilters')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
