import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useOrders } from '../../context/OrderContext';
import { Search, CheckCircle, Clock, Package, MessageCircle, AlertCircle } from 'lucide-react';

export default function OrderTracker({ initialOrderId = '' }) {
  const { t, isTamil } = useLanguage();
  const { findOrder, ORDER_STAGES } = useOrders();

  const [searchQuery, setSearchQuery] = useState(initialOrderId || 'ATCHU-2026-7891');
  const [currentOrder, setCurrentOrder] = useState(() => findOrder(initialOrderId || 'ATCHU-2026-7891'));
  const [searched, setSearched] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = findOrder(searchQuery);
    setCurrentOrder(found || null);
    setSearched(true);
  };

  const getStageIndex = (stageId) => {
    return ORDER_STAGES.findIndex((s) => s.id === stageId);
  };

  const currentStageIndex = currentOrder ? getStageIndex(currentOrder.productionStatus) : -1;

  return (
    <div className="container-narrow section-padding">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
          {t('tracker.title')}
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {t('tracker.subtitle')}
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ maxWidth: '520px', margin: '24px auto 0', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('tracker.inputPlaceholder')}
            className="input-styled"
            style={{ padding: '12px 16px' }}
          />
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            <Search size={18} />
            <span>{t('tracker.trackBtn')}</span>
          </button>
        </form>
      </div>

      {searched && !currentOrder && (
        <div className="card-premium" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <AlertCircle size={40} color="var(--color-warning)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
            {isTamil ? 'ஆர்டர் கிடைக்கவில்லை' : 'Order Not Found'}
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            {isTamil
              ? 'தயவுசெய்து சரியான ஆர்டர் எண் அல்லது மொபைல் எண்ணை உள்ளிடவும்.'
              : 'Please verify the order ID (e.g. ATCHU-2026-7891) or the registered mobile number.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button
              onClick={() => { setSearchQuery('ATCHU-2026-7891'); setCurrentOrder(findOrder('ATCHU-2026-7891')); }}
              className="btn btn-sm btn-outline-gold"
            >
              {isTamil ? 'மாதிரி ஆர்டர் 1 பார்க்க' : 'View Sample Order 1'}
            </button>
            <button
              onClick={() => { setSearchQuery('ATCHU-2026-7892'); setCurrentOrder(findOrder('ATCHU-2026-7892')); }}
              className="btn btn-sm btn-outline-gold"
            >
              {isTamil ? 'நேரடி ஆர்டர் 2 பார்க்க' : 'View Walk-in Order 2'}
            </button>
          </div>
        </div>
      )}

      {currentOrder && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
          {/* Order Meta Header Card */}
          <div className="card-premium" style={{ padding: 'var(--space-24)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-gold">{currentOrder.id}</span>
                <span className={`status-badge status-${currentOrder.productionStatus}`}>
                  {t(`tracker.status.${currentOrder.productionStatus}`)}
                </span>
                {currentOrder.type === 'offline_walkin' && (
                  <span className="badge badge-primary">{isTamil ? 'கடை நேரடி ஆர்டர்' : 'Walk-in Store Order'}</span>
                )}
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>
                {currentOrder.customer.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                {currentOrder.customer.address}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {isTamil ? 'நிகழ்ச்சி / டெலிவரி நாள்' : 'Target Completion'}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                {currentOrder.targetDate || 'Priority Schedule'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-success)', marginTop: '2px' }}>
                {isTamil ? 'தொகை' : 'Total'}: ₹{currentOrder.totalAmount?.toLocaleString('en-IN')} ({currentOrder.paymentStatus})
              </div>
            </div>
          </div>

          {/* Ordered Item Card */}
          {currentOrder.items?.map((item, idx) => (
            <div
              key={idx}
              className="card-premium"
              style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}
            >
              <img
                src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                alt="Blouse"
                style={{ width: 68, height: 84, objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
              />
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)' }}>
                  {isTamil ? item.productName_ta : item.productName_en}
                </h4>
                {item.customization && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    {typeof item.customization.neck === 'string' ? item.customization.neck : item.customization.neck?.name_en} •{' '}
                    {typeof item.customization.aari === 'string' ? item.customization.aari : item.customization.aari?.name_en}
                  </div>
                )}
              </div>
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  isTamil
                    ? `வணக்கம், என் பிளவுஸ் ஆர்டர் ${currentOrder.id} இன் நிலையைத் தெரிந்துகொள்ள விரும்புகிறேன்.`
                    : `Hello, I would like an update on my blouse order ${currentOrder.id}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-gold"
              >
                <MessageCircle size={14} />
                <span>{isTamil ? 'டெய்லருக்கு வாட்ஸ்அப்' : 'WhatsApp Tailor'}</span>
              </a>
            </div>
          ))}

          {/* Real-time Order Production Timeline */}
          <div className="card-premium" style={{ padding: 'var(--space-32)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '24px' }}>
              {isTamil ? 'தையல் & ஆரி வேலை முன்னேற்றப் பாதை' : 'Production Milestones'}
            </h3>

            <div className="order-timeline">
              {ORDER_STAGES.map((st, index) => {
                const isCompleted = index < currentStageIndex;
                const isActive = index === currentStageIndex;
                const isPending = index > currentStageIndex;

                return (
                  <div
                    key={st.id}
                    className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    <div className="timeline-node">
                      {isCompleted ? <CheckCircle size={15} /> : index + 1}
                    </div>
                    <div>
                      <div className="timeline-label">
                        {t(`tracker.status.${st.id}`)}
                      </div>
                      <div className="timeline-desc">
                        {isActive && (
                          <span style={{ color: 'var(--color-gold-dark)', fontWeight: 600 }}>
                            ● {isTamil ? 'தற்போது இந்த நிலை நடைபெறுகிறது' : 'Currently in progress at our atelier'}
                          </span>
                        )}
                        {isCompleted && (
                          <span style={{ color: 'var(--color-success)' }}>
                            ✓ {isTamil ? 'வெற்றிகரமாக முடிந்தது' : 'Completed'}
                          </span>
                        )}
                        {isPending && (
                          <span style={{ color: 'var(--color-text-light)' }}>
                            {isTamil ? 'அடுத்த கட்ட பணி' : 'Upcoming milestone'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
