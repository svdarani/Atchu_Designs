import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import { X, Plus, CheckCircle } from 'lucide-react';

export default function AdminProductModal({ isOpen, onClose, onProductCreated }) {
  const { isTamil } = useLanguage();
  const { categories, addProduct } = useShop();

  const [name_en, setNameEn] = useState('');
  const [name_ta, setNameTa] = useState('');
  const [category, setCategory] = useState('bridal');
  const [workType_en, setWorkTypeEn] = useState('Antique Zardosi & Cutwork');
  const [workType_ta, setWorkTypeTa] = useState('ஆன்டிக் சர்தோசி & கட்வொர்க்');
  const [startingPrice, setStartingPrice] = useState(3600);
  const [baseStitchingPrice, setBaseStitchingPrice] = useState(1100);
  const [baseAariPrice, setBaseAariPrice] = useState(2500);
  const [estimatedDays, setEstimatedDays] = useState('8-10 Days');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80');
  const [description_en, setDescriptionEn] = useState('Hand-embroidered zardosi bridal blouse with pure antique zari and kundan stone work.');
  const [description_ta, setDescriptionTa] = useState('அசல் ஆன்டிக் ஜரி மற்றும் குந்தன் கற்கள் பதிக்கப்பட்ட பிரத்யேக கைவினை ஆரி மணப்பெண் பிளவுஸ்.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name_en || !name_ta) {
      alert('Please enter both English and Tamil product titles');
      return;
    }

    const newProd = addProduct({
      name_en,
      name_ta,
      category,
      workType: 'custom',
      workType_en,
      workType_ta,
      occasion: 'wedding',
      occasion_en: 'Bridal Muhurtham',
      occasion_ta: 'முகூர்த்தம்',
      startingPrice: Number(startingPrice),
      baseStitchingPrice: Number(baseStitchingPrice),
      baseAariPrice: Number(baseAariPrice),
      estimatedDays,
      images: [imageUrl],
      description_en,
      description_ta
    });

    if (onProductCreated) onProductCreated(newProd);
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
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>
            {isTamil ? 'புதிய பிளவுஸ் டிசைன் சேர்க்க (Add Product)' : 'Add New Blouse Design to Atelier'}
          </h3>
          <button onClick={onClose} style={{ padding: 6 }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-body">
          {/* Dual Language Names */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div className="measurement-field">
              <label className="field-label">Product Name (English) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Mayura Peacock Zardosi"
                value={name_en}
                onChange={(e) => setNameEn(e.target.value)}
                className="input-styled"
              />
            </div>
            <div className="measurement-field">
              <label className="field-label">தயாரிப்பு பெயர் (Tamil) *</label>
              <input
                type="text"
                required
                placeholder="உதா: ராயல் மயூரா மயில் சர்தோசி"
                value={name_ta}
                onChange={(e) => setNameTa(e.target.value)}
                className="input-styled"
              />
            </div>
          </div>

          {/* Category & Work Type */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div className="measurement-field">
              <label className="field-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-styled"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name_en}</option>
                ))}
              </select>
            </div>
            <div className="measurement-field">
              <label className="field-label">Work Type (EN)</label>
              <input
                type="text"
                value={workType_en}
                onChange={(e) => setWorkTypeEn(e.target.value)}
                className="input-styled"
              />
            </div>
            <div className="measurement-field">
              <label className="field-label">வேலைப்பாடு வகை (TA)</label>
              <input
                type="text"
                value={workType_ta}
                onChange={(e) => setWorkTypeTa(e.target.value)}
                className="input-styled"
              />
            </div>
          </div>

          {/* Pricing Tiers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div className="measurement-field">
              <label className="field-label">Starting Price (₹)</label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                className="input-styled"
              />
            </div>
            <div className="measurement-field">
              <label className="field-label">Base Stitching (₹)</label>
              <input
                type="number"
                value={baseStitchingPrice}
                onChange={(e) => setBaseStitchingPrice(e.target.value)}
                className="input-styled"
              />
            </div>
            <div className="measurement-field">
              <label className="field-label">Base Aari Embroidery (₹)</label>
              <input
                type="number"
                value={baseAariPrice}
                onChange={(e) => setBaseAariPrice(e.target.value)}
                className="input-styled"
              />
            </div>
          </div>

          {/* Image & Turnaround */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="measurement-field">
              <label className="field-label">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="input-styled"
              />
            </div>
            <div className="measurement-field">
              <label className="field-label">Stitching Turnaround</label>
              <input
                type="text"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                className="input-styled"
              />
            </div>
          </div>

          {/* Bilingual Descriptions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div className="measurement-field">
              <label className="field-label">Description (English)</label>
              <textarea
                rows={3}
                value={description_en}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="input-styled"
              />
            </div>
            <div className="measurement-field">
              <label className="field-label">விவரம் (Tamil)</label>
              <textarea
                rows={3}
                value={description_ta}
                onChange={(e) => setDescriptionTa(e.target.value)}
                className="input-styled"
              />
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={16} />
              <span>{isTamil ? 'தயாரிப்பை வெளியிட' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
