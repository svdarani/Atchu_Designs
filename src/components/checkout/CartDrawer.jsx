import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle, Clock } from 'lucide-react';

export default function CartDrawer({ onProceedToCheckout }) {
  const { t, isTamil } = useLanguage();
  const {
    cart,
    cartSubtotal,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity
  } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
              {t('cart.title')} ({cartItemCount})
            </h3>
          </div>
          <button onClick={() => setIsCartOpen(false)} style={{ padding: 6 }}>
            <X size={20} />
          </button>
        </div>

        {/* Body Items */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '40px 20px' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'var(--color-gold-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--color-gold-dark)'
                }}
              >
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: 6 }}>
                {t('cart.emptyTitle')}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                {t('cart.emptySubtitle')}
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const prod = item.product;
              const custom = item.customization;
              const measure = item.measurements;

              return (
                <div
                  key={item.cartItemId}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    display: 'flex',
                    gap: '12px'
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                    alt={isTamil ? prod.name_ta : prod.name_en}
                    style={{
                      width: '74px',
                      height: '92px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-xs)',
                      flexShrink: 0
                    }}
                  />

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.92rem', color: 'var(--color-primary-dark)', lineHeight: 1.3 }}>
                        {isTamil ? prod.name_ta : prod.name_en}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        style={{ color: 'var(--color-text-light)', padding: '2px' }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Custom Specs Summary */}
                    {custom && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', margin: '4px 0', lineHeight: 1.4 }}>
                        <div>{isTamil ? 'கழுத்து' : 'Neck'}: {isTamil ? custom.neck?.name_ta : custom.neck?.name_en}</div>
                        <div>{isTamil ? 'ஆரி' : 'Aari'}: {isTamil ? custom.aari?.name_ta : custom.aari?.name_en}</div>
                      </div>
                    )}

                    {/* Measurement Status Badge */}
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {measure?.status === 'provided' ? (
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <CheckCircle size={12} />
                          <span>{t('cart.measurementsProvided')}</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Clock size={12} />
                          <span>{t('cart.measurementsPending')}</span>
                        </span>
                      )}

                      {/* Quantity Stepper & Price */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 4 }}>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                            style={{ padding: '2px 6px' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '0.8rem', padding: '0 6px', fontWeight: 600 }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                            style={{ padding: '2px 6px' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)' }}>
                          ₹{((item.unitPrice || 0) * item.quantity).toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>{t('cart.subtotal')}</span>
              <strong>₹{cartSubtotal.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.82rem', color: 'var(--color-success)' }}>
              <span>{t('cart.shipping')}</span>
              <span>{t('cart.shippingFree')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              <span>{t('cart.total')}</span>
              <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="btn btn-gold btn-lg"
              style={{ width: '100%' }}
            >
              <span>{t('cart.proceedCheckout')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
