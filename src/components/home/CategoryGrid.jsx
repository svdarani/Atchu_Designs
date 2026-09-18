import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CategoryGrid({ onSelectCategory }) {
  const { t, isTamil } = useLanguage();
  const { categories } = useShop();

  return (
    <section className="section-padding" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--color-gold-dark)" />
            <span className="section-eyebrow">{isTamil ? 'சேகரிப்புகள்' : 'Curated Atelier'}</span>
          </div>
          <h2 className="section-title">{t('categories.sectionTitle')}</h2>
          <p className="section-desc">{t('categories.sectionSubtitle')}</p>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => onSelectCategory(cat.id)}
            >
              <img
                src={cat.image}
                alt={isTamil ? cat.name_ta : cat.name_en}
                className="category-img"
                loading="lazy"
              />
              <div className="category-overlay">
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-gold-light)', letterSpacing: '0.1em', marginBottom: 4 }}>
                  {cat.itemCount} {isTamil ? 'வடிவமைப்புகள்' : 'Designs'}
                </span>
                <h3 className="category-title">
                  {isTamil ? cat.name_ta : cat.name_en}
                </h3>
                <p className="category-desc">
                  {isTamil ? cat.desc_ta : cat.desc_en}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold-light)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>{isTamil ? 'பாருங்கள்' : 'Explore Category'}</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
