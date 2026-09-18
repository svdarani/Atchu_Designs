import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useOrders } from '../../context/OrderContext';
import { X, Calculator, Send, CheckCircle } from 'lucide-react';

export default function AdminQuoteModal({ isOpen, onClose, quote, onQuoteSent }) {
  const { isTamil } = useLanguage();
  const { sendQuoteEstimate } = useOrders();

  const [baseStitching, setBaseStitching] = useState(1100);
  const [aariWork, setAariWork] = useState(2800);
  const [fabricCost, setFabricCost] = useState(500);
  const [tassels, setTassels] = useState(350);
  const [discount, setDiscount] = useState(250);
  const [estimatedDays, setEstimatedDays] = useState('8-10 Business Days');
  const [designerNotes, setDesignerNotes] = useState(
    'Includes emerald green silk raw fabric. Lord Krishna peacock flute motif with antique gold nakshi wire and ruby kundan stones.'
  );

  if (!isOpen || !quote) return null;

  const total = Number(baseStitching) + Number(aariWork) + Number(fabricCost) + Number(tassels) - Number(discount);

  const handleSubmit = (e) => {
    e.preventDefault();

    const itemized = {
      baseStitching: Number(baseStitching),
      aariWork: Number(aariWork),
      fabricRawSilk: Number(fabricCost),
      tassels: Number(tassels),
      discount: Number(discount),
      total,
      estimatedDays,
      designerNotes
    };

    sendQuoteEstimate(quote.id, itemized);
    if (onQuoteSent) onQuoteSent(quote.id, itemized);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal"
        style={{ maxWidth: '780px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={20} color="var(--color-gold-dark)" />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>
              {isTamil ? `விலை மதிப்பீடு உருவாக்க: ${quote.id}` : `Build Custom Quote: ${quote.id}`}
            </h3>
          </div>
          <button onClick={onClose} style={{ padding: 6 }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-body">
          {/* Customer & Reference Montage */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, background: 'var(--color-bg)', padding: 14, borderRadius: 'var(--radius-sm)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Customer Reference:</span>
              <img
                src={quote.referenceImages?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                alt="Reference"
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', marginTop: 4 }}
              />
            </div>
            <div>
              <h4 style={{ color: 'var(--color-primary-dark)', fontSize: '1.1rem' }}>{quote.customerName}</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>Phone: {quote.phone} | Target Date: <strong>{quote.eventDate}</strong></p>
              <div style={{ fontSize: '0.85rem', margin: '8px 0', padding: '8px', background: '#FFFFFF', borderRadius: 4 }}>
                <strong>Customer Notes:</strong> {quote.requirements}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)' }}>
                Target Budget: ₹{quote.targetBudget} | Fabric: {quote.fabricSource === 'boutiqueProvides' ? 'Boutique to provide' : 'Customer provides'}
              </div>
            </div>
          </div>

          {/* Itemized Cost Breakdown */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)', marginBottom: 10 }}>
              {isTamil ? 'கட்டண கணக்கீடு (Itemized Pricing)' : 'Itemized Price Calculation'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Base Stitching (₹)</label>
                <input
                  type="number"
                  value={baseStitching}
                  onChange={(e) => setBaseStitching(e.target.value)}
                  className="input-styled"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Aari Embroidery (₹)</label>
                <input
                  type="number"
                  value={aariWork}
                  onChange={(e) => setAariWork(e.target.value)}
                  className="input-styled"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Fabric / Raw Silk (₹)</label>
                <input
                  type="number"
                  value={fabricCost}
                  onChange={(e) => setFabricCost(e.target.value)}
                  className="input-styled"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Latkans / Dori (₹)</label>
                <input
                  type="number"
                  value={tassels}
                  onChange={(e) => setTassels(e.target.value)}
                  className="input-styled"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Special Discount (₹)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="input-styled"
                />
              </div>
            </div>
          </div>

          {/* Turnaround & Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
            <div className="measurement-field">
              <label className="field-label">Turnaround Days</label>
              <input
                type="text"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                className="input-styled"
              />
            </div>
            <div className="measurement-field">
              <label className="field-label">Designer Notes to Customer</label>
              <input
                type="text"
                value={designerNotes}
                onChange={(e) => setDesignerNotes(e.target.value)}
                className="input-styled"
              />
            </div>
          </div>

          {/* Final Calculated Quote */}
          <div style={{ background: 'var(--color-primary-subtle)', padding: 16, borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
              Total Final Quote to Customer:
            </span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="admin-modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-gold">
              <Send size={16} />
              <span>{isTamil ? 'மதிப்பீட்டை வாடிக்கையாளருக்கு அனுப்புக' : 'Send Quote to Customer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
