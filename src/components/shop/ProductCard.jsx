import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { Heart, SlidersHorizontal, Eye } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct, onQuickCustomize }) {
  const { isTamil, t } = useLanguage();
  const { toggleWishlist, isInWishlist } = useShop();

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="product-card">
      {/* Media Image Container */}
      <div
        className="product-media"
        onClick={() => onSelectProduct(product)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={product.images[0]}
          alt={isTamil ? product.name_ta : product.name_en}
          className="product-thumb"
          loading="lazy"
        />

        {/* Top Badges */}
        {product.tag && (
          <span className="product-badge-float badge badge-gold">
            {product.tag}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          className={`product-wishlist-float ${isFavorited ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Body Content */}
      <div className="product-body">
        <span className="product-work-tag">
          {isTamil ? product.workType_ta : product.workType_en}
        </span>

        <h3
          className="product-name"
          onClick={() => onSelectProduct(product)}
          style={{ cursor: 'pointer' }}
        >
          {isTamil ? product.name_ta : product.name_en}
        </h3>

        {/* Pricing Row */}
        <div className="product-pricing-row">
          <div>
            <div className="price-label">{t('shop.startingFrom')}</div>
            <div className="price-val">₹{product.startingPrice.toLocaleString('en-IN')}</div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'var(--color-surface-subtle)', padding: '3px 8px', borderRadius: '4px' }}>
            {product.estimatedDays}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions">
          <button
            onClick={() => onSelectProduct(product)}
            className="btn btn-sm btn-outline"
            style={{ fontSize: '0.8rem', padding: '7px 8px' }}
          >
            <Eye size={14} />
            <span>{t('shop.viewDetails')}</span>
          </button>
          <button
            onClick={() => onQuickCustomize(product)}
            className="btn btn-sm btn-primary"
            style={{ fontSize: '0.8rem', padding: '7px 8px' }}
          >
            <SlidersHorizontal size={14} />
            <span>{isTamil ? 'மாற்றுக' : 'Customize'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
