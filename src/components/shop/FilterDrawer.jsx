import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { X, Filter, Check } from 'lucide-react';

export default function FilterDrawer({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedWorkType,
  onSelectWorkType,
  priceRange,
  onSelectPriceRange,
  onClearFilters
}) {
  const { t, isTamil } = useLanguage();
  const { categories } = useShop();

  const workTypes = [
    { id: 'all', label_en: 'All Work Types', label_ta: 'அனைத்து வேலைப்பாடுகள்' },
    { id: 'zardosi', label_en: 'Antique Zardosi & Nakshi', label_ta: 'ஆன்டிக் சர்தோசி' },
    { id: 'kundan', label_en: 'Kundan & Temple Stone', label_ta: 'குந்தன் & கல் வேலை' },
    { id: 'cutwork', label_en: 'Lotus Cutwork & Pearls', label_ta: 'தாமரை கட்வொர்க்' },
    { id: 'maggam', label_en: 'Heavy Heritage Maggam', label_ta: 'பாரம்பரிய மக்கம்' },
    { id: 'thread', label_en: 'Silk Resham Thread & Buttis', label_ta: 'சில்க் நூல் புட்டா' },
    { id: 'piping', label_en: 'Contrast Piping & Potli', label_ta: 'பைப்லைன் & பொட்லி' }
  ];

  const priceRanges = [
    { id: 'all', label: isTamil ? 'அனைத்து விலைகள்' : 'All Prices' },
    { id: 'under2500', label: isTamil ? '₹2,500 க்கும் கீழ்' : 'Under ₹2,500' },
    { id: '2500to4000', label: '₹2,500 - ₹4,000' },
    { id: 'above4000', label: isTamil ? '₹4,000 க்கும் மேல்' : 'Above ₹4,000' }
  ];

  return (
    <>
      {/* Desktop Sidebar / Mobile Drawer */}
      <div
        className={`filter-container ${isOpen ? 'mobile-open' : ''}`}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-20)',
          height: 'fit-content'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            <Filter size={18} color="var(--color-gold-dark)" />
            <span>{t('shop.filters')}</span>
          </div>
          <button
            onClick={onClearFilters}
            style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'underline' }}
          >
            {t('shop.clearAll')}
          </button>
        </div>

        {/* Categories Section */}
        <div style={{ marginBottom: '24px' }}>
          <div className="option-group-title">{t('shop.category')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => onSelectCategory('all')}
              style={{
                textAlign: 'left',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: selectedCategory === 'all' ? 700 : 500,
                background: selectedCategory === 'all' ? 'var(--color-primary-subtle)' : 'transparent',
                color: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-text-main)'
              }}
            >
              {isTamil ? 'அனைத்து பிரிவுகள்' : 'All Collections'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  background: selectedCategory === cat.id ? 'var(--color-primary-subtle)' : 'transparent',
                  color: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-text-main)'
                }}
              >
                {isTamil ? cat.name_ta : cat.name_en}
              </button>
            ))}
          </div>
        </div>

        {/* Work Type Section */}
        <div style={{ marginBottom: '24px' }}>
          <div className="option-group-title">{t('shop.workType')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {workTypes.map((wt) => (
              <button
                key={wt.id}
                onClick={() => onSelectWorkType(wt.id)}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: selectedWorkType === wt.id ? 700 : 500,
                  background: selectedWorkType === wt.id ? 'var(--color-primary-subtle)' : 'transparent',
                  color: selectedWorkType === wt.id ? 'var(--color-primary)' : 'var(--color-text-main)'
                }}
              >
                {isTamil ? wt.label_ta : wt.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Section */}
        <div>
          <div className="option-group-title">{t('shop.priceRange')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {priceRanges.map((pr) => (
              <button
                key={pr.id}
                onClick={() => onSelectPriceRange(pr.id)}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: priceRange === pr.id ? 700 : 500,
                  background: priceRange === pr.id ? 'var(--color-primary-subtle)' : 'transparent',
                  color: priceRange === pr.id ? 'var(--color-primary)' : 'var(--color-text-main)'
                }}
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
