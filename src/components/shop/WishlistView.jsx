import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import ProductCard from './ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function WishlistView({ onSelectProduct, onExplore }) {
  const { t, isTamil } = useLanguage();
  const { wishlist } = useShop();

  return (
    <div className="container section-padding animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}
        >
          <Heart size={26} fill="currentColor" />
        </div>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
          {isTamil ? 'உங்கள் விருப்பப் பிளவுஸ்கள்' : 'My Saved Wishlist'}
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {isTamil ? 'உங்களுக்கு பிடித்த வடிவமைப்புகள் இங்கே சேமிக்கப்பட்டுள்ளன.' : 'Artisanal blouse designs you cherish and saved for special occasions.'}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="card-premium" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <ShoppingBag size={40} color="var(--color-gold-dark)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
            {isTamil ? 'விருப்பப் பட்டியல் காலியாக உள்ளது' : 'Your Wishlist is Empty'}
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            {isTamil ? 'பிளவுஸ் வடிவமைப்புகளைப் பார்த்து விரும்பியவற்றை சேமிக்கலாம்.' : 'Explore handcrafted bridal blouses and click the heart icon to save designs.'}
          </p>
          <button onClick={onExplore} className="btn btn-gold">
            <span>{isTamil ? 'பிளவுஸ்களைப் பாருங்கள்' : 'Explore Blouse Designs'}</span>
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map((prod) => (
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
  );
}
