import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  NECK_STYLES,
  SLEEVE_STYLES,
  BACK_STYLES,
  AARI_WORK_LEVELS,
  ADDONS
} from '../../data/customizationOptions';
import { Sparkles, Upload, Check, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function CustomizerForm({ product, onProceedToMeasurements }) {
  const { t, isTamil } = useLanguage();

  const [selectedNeck, setSelectedNeck] = useState(NECK_STYLES[0].id);
  const [selectedSleeve, setSelectedSleeve] = useState(SLEEVE_STYLES[0].id);
  const [selectedBack, setSelectedBack] = useState(BACK_STYLES[0].id);
  const [selectedAari, setSelectedAari] = useState(AARI_WORK_LEVELS[1].id); // default Medium
  const [selectedAddons, setSelectedAddons] = useState(['padding']);
  const [referencePhoto, setReferencePhoto] = useState(null);
  const [customerNote, setCustomerNote] = useState('');

  // Toggle add-ons
  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Handle local image file upload for design reference
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReferencePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Price calculations
  const priceBreakdown = useMemo(() => {
    const baseStitching = product.baseStitchingPrice || 1100;
    const baseAari = product.baseAariPrice || 1650;

    const neckOpt = NECK_STYLES.find((n) => n.id === selectedNeck) || NECK_STYLES[0];
    const sleeveOpt = SLEEVE_STYLES.find((s) => s.id === selectedSleeve) || SLEEVE_STYLES[0];
    const backOpt = BACK_STYLES.find((b) => b.id === selectedBack) || BACK_STYLES[0];
    const aariOpt = AARI_WORK_LEVELS.find((a) => a.id === selectedAari) || AARI_WORK_LEVELS[1];

    const addonsCost = selectedAddons.reduce((sum, id) => {
      const item = ADDONS.find((a) => a.id === id);
      return sum + (item ? item.price : 0);
    }, 0);

    const designUpgrades = neckOpt.price + sleeveOpt.price + backOpt.price;
    const aariCost = baseAari + aariOpt.priceAdd;
    const total = baseStitching + aariCost + designUpgrades + addonsCost;

    return {
      baseStitching,
      aariCost,
      designUpgrades,
      addonsCost,
      total,
      neckOpt,
      sleeveOpt,
      backOpt,
      aariOpt
    };
  }, [product, selectedNeck, selectedSleeve, selectedBack, selectedAari, selectedAddons]);

  const handleProceed = () => {
    const customizationData = {
      neck: priceBreakdown.neckOpt,
      sleeve: priceBreakdown.sleeveOpt,
      back: priceBreakdown.backOpt,
      aari: priceBreakdown.aariOpt,
      addons: selectedAddons.map((id) => ADDONS.find((a) => a.id === id)),
      referencePhoto,
      customerNote,
      priceBreakdown
    };
    onProceedToMeasurements(customizationData, priceBreakdown.total);
  };

  return (
    <div className="customizer-box">
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
          {t('customizer.title')}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          {t('customizer.subtitle')}
        </p>
      </div>

      {/* 1. Neck Style */}
      <div style={{ marginBottom: '20px' }}>
        <div className="option-group-title">
          <span>{t('customizer.neckStyle')}</span>
        </div>
        <div className="option-chips-grid">
          {NECK_STYLES.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedNeck(opt.id)}
              className={`option-chip ${selectedNeck === opt.id ? 'selected' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="option-chip-title">{isTamil ? opt.name_ta : opt.name_en}</span>
                {selectedNeck === opt.id && <Check size={14} color="var(--color-primary)" />}
              </div>
              <span className="option-chip-price">
                {opt.price === 0 ? (isTamil ? 'அடிப்படை' : 'Standard') : `+₹${opt.price}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Sleeve Style */}
      <div style={{ marginBottom: '20px' }}>
        <div className="option-group-title">
          <span>{t('customizer.sleeveStyle')}</span>
        </div>
        <div className="option-chips-grid">
          {SLEEVE_STYLES.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedSleeve(opt.id)}
              className={`option-chip ${selectedSleeve === opt.id ? 'selected' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="option-chip-title">{isTamil ? opt.name_ta : opt.name_en}</span>
                {selectedSleeve === opt.id && <Check size={14} color="var(--color-primary)" />}
              </div>
              <span className="option-chip-price">
                {opt.price === 0 ? (isTamil ? 'அடிப்படை' : 'Standard') : `+₹${opt.price}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Back Style */}
      <div style={{ marginBottom: '20px' }}>
        <div className="option-group-title">
          <span>{t('customizer.backStyle')}</span>
        </div>
        <div className="option-chips-grid">
          {BACK_STYLES.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedBack(opt.id)}
              className={`option-chip ${selectedBack === opt.id ? 'selected' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="option-chip-title">{isTamil ? opt.name_ta : opt.name_en}</span>
                {selectedBack === opt.id && <Check size={14} color="var(--color-primary)" />}
              </div>
              <span className="option-chip-price">
                {opt.price === 0 ? (isTamil ? 'அடிப்படை' : 'Standard') : `+₹${opt.price}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Aari Embroidery Intensity */}
      <div style={{ marginBottom: '20px' }}>
        <div className="option-group-title">
          <span>{t('customizer.aariDensity')}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
          {AARI_WORK_LEVELS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedAari(opt.id)}
              className={`option-chip ${selectedAari === opt.id ? 'selected' : ''}`}
              style={{ padding: '12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="option-chip-title">{isTamil ? opt.name_ta : opt.name_en}</span>
                {selectedAari === opt.id && <Check size={14} color="var(--color-primary)" />}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '4px 0' }}>
                {isTamil ? opt.desc_ta : opt.desc_en}
              </p>
              <span className="option-chip-price">
                +₹{opt.priceAdd.toLocaleString('en-IN')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Addons & Upgrades */}
      <div style={{ marginBottom: '20px' }}>
        <div className="option-group-title">{t('customizer.addOns')}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {ADDONS.map((addon) => {
            const isChecked = selectedAddons.includes(addon.id);
            return (
              <button
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: isChecked ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: isChecked ? 'var(--color-primary-subtle)' : '#FFFFFF',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: '1px solid var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isChecked ? 'var(--color-primary)' : 'transparent'
                  }}
                >
                  {isChecked && <Check size={12} color="#FFFFFF" />}
                </div>
                <span>{isTamil ? addon.name_ta : addon.name_en} (+₹{addon.price})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Reference Photo Upload */}
      <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--color-border-gold)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Upload size={16} color="var(--color-gold-dark)" />
          <strong style={{ fontSize: '0.86rem', color: 'var(--color-primary-dark)' }}>
            {t('customizer.uploadReference')}
          </strong>
        </div>
        <input
          type="file"
          accept="image/*"
          id="custom-ref-photo"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label htmlFor="custom-ref-photo" className="btn btn-sm btn-outline-gold" style={{ cursor: 'pointer' }}>
            <ImageIcon size={14} />
            <span>{t('customizer.uploadBtn')}</span>
          </label>
          {referencePhoto && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={referencePhoto}
                alt="Reference design"
                style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 600 }}>
                ✓ {isTamil ? 'படம் இணைக்கப்பட்டுள்ளது' : 'Reference Image Attached'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Live Price Tally Bar */}
      <div className="price-tally-bar">
        <div>
          <div className="tally-label">{t('customizer.totalPrice')}</div>
          <div style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: '2px' }}>
            {isTamil ? 'அடிப்படை தையல்' : 'Base'}: ₹{priceBreakdown.baseStitching} | {isTamil ? 'ஆரி வேலை' : 'Aari'}: ₹{priceBreakdown.aariCost} | {isTamil ? 'வடிவமைப்பு' : 'Options'}: ₹{priceBreakdown.designUpgrades + priceBreakdown.addonsCost}
          </div>
        </div>
        <div className="tally-amount">
          ₹{priceBreakdown.total.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceed}
        className="btn btn-gold btn-lg"
        style={{ width: '100%', marginTop: '16px' }}
      >
        <span>{t('customizer.proceedToMeasure')}</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
