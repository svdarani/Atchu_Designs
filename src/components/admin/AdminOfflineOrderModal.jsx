import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { useOrders } from '../../context/OrderContext';
import { X, Store, CheckCircle, Plus } from 'lucide-react';

export default function AdminOfflineOrderModal({ isOpen, onClose, onOrderCreated }) {
  const { isTamil } = useLanguage();
  const { products } = useShop();
  const { createOfflineOrder } = useOrders();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [targetDate, setTargetDate] = useState('2026-10-15');
  const [customNeck, setCustomNeck] = useState('Royal Boat Neck');
  const [customSleeve, setCustomSleeve] = useState('Elbow Length + Heavy Aari Border');
  const [customAari, setCustomAari] = useState('Grand Bridal Zardosi & Cutwork');

  // Pricing
  const [basePrice, setBasePrice] = useState(1200);
  const [aariPrice, setAariPrice] = useState(2500);
  const [materialsPrice, setMaterialsPrice] = useState(300);
  const [advancePaid, setAdvancePaid] = useState(2000);
  const [paymentMode, setPaymentMode] = useState('cash'); // 'cash' | 'direct_upi' | 'card_pos'
  const [tailorNotes, setTailorNotes] = useState('Customer handed over raw silk fabric bit in person.');

  // In-shop Measurements
  const [measurements, setMeasurements] = useState({
    bust: '36',
    underBust: '30',
    waist: '30',
    shoulder: '14.5',
    armhole: '16',
    sleeveLength: '10.5',
    sleeveRound: '11',
    blouseLength: '14',
    frontNeck: '7',
    backNeck: '9.5'
  });

  if (!isOpen) return null;

  const totalAmount = Number(basePrice) + Number(aariPrice) + Number(materialsPrice);
  const balanceDue = Math.max(0, totalAmount - Number(advancePaid));

  const handleMeasureChange = (k, v) => {
    setMeasurements((prev) => ({ ...prev, [k]: v }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert('Please provide customer name and phone number');
      return;
    }

    const targetProduct = products.find((p) => p.id === selectedProductId) || products[0];

    const offlineOrderData = {
      customer: {
        name: customerName,
        phone,
        email: email || 'walkin@store.aatchucouture.in',
        address: 'Direct Walk-in Store Pickup (Madurai Atelier)'
      },
      items: [
        {
          productName_en: targetProduct.name_en,
          productName_ta: targetProduct.name_ta,
          image: targetProduct.images?.[0] || '',
          unitPrice: totalAmount,
          quantity: 1,
          customization: {
            neck: customNeck,
            sleeve: customSleeve,
            aari: customAari
          },
          measurements: {
            unit: 'inches',
            ...measurements
          }
        }
      ],
      totalAmount,
      paidAmount: Number(advancePaid),
      balanceDue,
      paymentMethod: paymentMode,
      targetDate,
      notes: tailorNotes
    };

    const newOrder = createOfflineOrder(offlineOrderData);
    if (onOrderCreated) onOrderCreated(newOrder);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal"
        style={{ maxWidth: '820px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={22} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>
              {isTamil ? 'நேரடி வாடிக்கையாளர் ஆர்டர் பதிவு (Offline Order)' : 'Create Walk-in Offline Order'}
            </h3>
          </div>
          <button onClick={onClose} style={{ padding: 6 }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-body">
          {/* Customer Info */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)', marginBottom: 8 }}>
              {isTamil ? '1. வாடிக்கையாளர் விவரம்' : '1. Walk-in Customer Details'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <input
                type="text"
                required
                placeholder="Customer Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input-styled"
              />
              <input
                type="tel"
                required
                placeholder="Mobile / WhatsApp Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-styled"
              />
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="input-styled"
              />
            </div>
          </div>

          {/* Product & Custom Styling */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)', marginBottom: 8 }}>
              {isTamil ? '2. பிளவுஸ் மாடல் & வேலைப்பாடு' : '2. Blouse Model & Specifications'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Base Design</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="input-styled"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name_en} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Aari Embroidery</label>
                <input
                  type="text"
                  value={customAari}
                  onChange={(e) => setCustomAari(e.target.value)}
                  className="input-styled"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Neck Style</label>
                <input
                  type="text"
                  value={customNeck}
                  onChange={(e) => setCustomNeck(e.target.value)}
                  className="input-styled"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Sleeve Style</label>
                <input
                  type="text"
                  value={customSleeve}
                  onChange={(e) => setCustomSleeve(e.target.value)}
                  className="input-styled"
                />
              </div>
            </div>
          </div>

          {/* In-store Measurements */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)', marginBottom: 8 }}>
              {isTamil ? '3. நேரடி அளவு எடுத்தல் (Inches)' : '3. Tailor Measurements Taken in Shop (Inches)'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Bust</span>
                <input
                  type="text"
                  value={measurements.bust}
                  onChange={(e) => handleMeasureChange('bust', e.target.value)}
                  className="input-styled"
                  style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Waist</span>
                <input
                  type="text"
                  value={measurements.waist}
                  onChange={(e) => handleMeasureChange('waist', e.target.value)}
                  className="input-styled"
                  style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Shoulder</span>
                <input
                  type="text"
                  value={measurements.shoulder}
                  onChange={(e) => handleMeasureChange('shoulder', e.target.value)}
                  className="input-styled"
                  style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Armhole</span>
                <input
                  type="text"
                  value={measurements.armhole}
                  onChange={(e) => handleMeasureChange('armhole', e.target.value)}
                  className="input-styled"
                  style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Length</span>
                <input
                  type="text"
                  value={measurements.blouseLength}
                  onChange={(e) => handleMeasureChange('blouseLength', e.target.value)}
                  className="input-styled"
                  style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Advance Cash / UPI */}
          <div style={{ background: 'var(--color-bg)', padding: 16, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)', marginBottom: 8 }}>
              {isTamil ? '4. கட்டணம் & அட்வான்ஸ் வரவு' : '4. Pricing & Advance Payment'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Base Stitching (₹)</span>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="input-styled"
                />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Aari Work (₹)</span>
                <input
                  type="number"
                  value={aariPrice}
                  onChange={(e) => setAariPrice(e.target.value)}
                  className="input-styled"
                />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Materials / Tassels (₹)</span>
                <input
                  type="number"
                  value={materialsPrice}
                  onChange={(e) => setMaterialsPrice(e.target.value)}
                  className="input-styled"
                />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Advance Received (₹)</span>
                <input
                  type="number"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(e.target.value)}
                  className="input-styled"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: '0.84rem' }}>Mode:</span>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="input-styled"
                  style={{ width: 'auto', padding: '6px 12px' }}
                >
                  <option value="cash">Cash (பணம்)</option>
                  <option value="direct_upi">Shop UPI / GPay</option>
                  <option value="card_pos">POS Card Machine</option>
                </select>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem' }}>Total: <strong>₹{totalAmount.toLocaleString('en-IN')}</strong> | Balance Due: <strong style={{ color: 'var(--color-danger)' }}>₹{balanceDue.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Tailor & Stitching Notes</label>
            <input
              type="text"
              value={tailorNotes}
              onChange={(e) => setTailorNotes(e.target.value)}
              className="input-styled"
            />
          </div>

          <div className="admin-modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={16} />
              <span>{isTamil ? 'நேரடி ஆர்டரை உருவாக்க' : 'Generate Walk-in Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
