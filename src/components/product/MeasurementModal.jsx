import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useShop } from '../../context/ShopContext';
import {
  Ruler,
  Upload,
  Video,
  Clock,
  CheckCircle,
  X,
  HelpCircle,
  Bookmark
} from 'lucide-react';

export default function MeasurementModal({ isOpen, onClose, onSaveMeasurements, initialMeasurements = null }) {
  const { t, isTamil } = useLanguage();
  const { measurementProfiles, saveMeasurementProfile } = useShop();

  const [unit, setUnit] = useState('inches');
  const [method, setMethod] = useState('manual'); // 'manual' | 'upload' | 'later' | 'videocall'
  const [profileName, setProfileName] = useState('');
  const [sampleBlousePhoto, setSampleBlousePhoto] = useState(null);

  // Form fields
  const [measurements, setMeasurements] = useState({
    bust: initialMeasurements?.bust || '36',
    underBust: initialMeasurements?.underBust || '30',
    waist: initialMeasurements?.waist || '30',
    shoulder: initialMeasurements?.shoulder || '14.5',
    armhole: initialMeasurements?.armhole || '16',
    sleeveLength: initialMeasurements?.sleeveLength || '10.5',
    sleeveRound: initialMeasurements?.sleeveRound || '11',
    blouseLength: initialMeasurements?.blouseLength || '14',
    frontNeck: initialMeasurements?.frontNeck || '7',
    backNeck: initialMeasurements?.backNeck || '9.5'
  });

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setMeasurements((prev) => ({ ...prev, [field]: val }));
  };

  const handleApplyProfile = (prof) => {
    setUnit(prof.unit || 'inches');
    setMeasurements({
      bust: prof.bust || '',
      underBust: prof.underBust || '',
      waist: prof.waist || '',
      shoulder: prof.shoulder || '',
      armhole: prof.armhole || '',
      sleeveLength: prof.sleeveLength || '',
      sleeveRound: prof.sleeveRound || '',
      blouseLength: prof.blouseLength || '',
      frontNeck: prof.frontNeck || '',
      backNeck: prof.backNeck || ''
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSampleBlousePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    const data = {
      unit,
      method,
      measurements: method === 'manual' ? measurements : null,
      sampleBlousePhoto: method === 'upload' ? sampleBlousePhoto : null,
      status: method === 'later' ? 'pending_tailor_call' : 'provided'
    };

    if (profileName.trim() && method === 'manual') {
      saveMeasurementProfile({
        name: profileName.trim(),
        unit,
        ...measurements
      });
    }

    onSaveMeasurements(data);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="admin-modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Ruler size={20} color="var(--color-gold-dark)" />
              <span>{t('measurements.title')}</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {t('measurements.subtitle')}
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="admin-modal-body">
          {/* Method Selection Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
            <button
              onClick={() => setMethod('manual')}
              className={`option-chip ${method === 'manual' ? 'selected' : ''}`}
              style={{ textAlign: 'center', padding: '10px' }}
            >
              <Ruler size={18} style={{ margin: '0 auto 4px' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t('measurements.manual')}</span>
            </button>
            <button
              onClick={() => setMethod('upload')}
              className={`option-chip ${method === 'upload' ? 'selected' : ''}`}
              style={{ textAlign: 'center', padding: '10px' }}
            >
              <Upload size={18} style={{ margin: '0 auto 4px' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{isTamil ? 'அளவு படம் பதிவேற்றம்' : 'Upload Slip / Blouse'}</span>
            </button>
            <button
              onClick={() => setMethod('later')}
              className={`option-chip ${method === 'later' ? 'selected' : ''}`}
              style={{ textAlign: 'center', padding: '10px' }}
            >
              <Clock size={18} style={{ margin: '0 auto 4px' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t('measurements.submitLater')}</span>
            </button>
            <button
              onClick={() => setMethod('videocall')}
              className={`option-chip ${method === 'videocall' ? 'selected' : ''}`}
              style={{ textAlign: 'center', padding: '10px' }}
            >
              <Video size={18} style={{ margin: '0 auto 4px' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{isTamil ? 'வீடியோ வழிகாட்டல்' : 'Video Call Assistance'}</span>
            </button>
          </div>

          {/* Saved Profiles Quick Loader */}
          {method === 'manual' && measurementProfiles.length > 0 && (
            <div style={{ background: 'var(--color-surface-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--color-primary-dark)' }}>
                <Bookmark size={15} color="var(--color-gold-dark)" />
                <strong>{isTamil ? 'சேமிக்கப்பட்ட அளவுகள்:' : 'Saved Fit Profiles:'}</strong>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {measurementProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleApplyProfile(p)}
                    className="btn btn-sm btn-outline-gold"
                    style={{ fontSize: '0.76rem', padding: '4px 10px' }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 1: Manual Measurements Form */}
          {method === 'manual' && (
            <div>
              {/* Unit Toggle */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
                <div style={{ display: 'inline-flex', background: 'var(--color-border-subtle)', padding: '3px', borderRadius: 'var(--radius-pill)' }}>
                  <button
                    onClick={() => setUnit('inches')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.8rem',
                      fontWeight: unit === 'inches' ? 700 : 500,
                      background: unit === 'inches' ? 'var(--color-primary)' : 'transparent',
                      color: unit === 'inches' ? '#FFFFFF' : 'var(--color-text-muted)'
                    }}
                  >
                    {t('measurements.inches')}
                  </button>
                  <button
                    onClick={() => setUnit('cm')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.8rem',
                      fontWeight: unit === 'cm' ? 700 : 500,
                      background: unit === 'cm' ? 'var(--color-primary)' : 'transparent',
                      color: unit === 'cm' ? '#FFFFFF' : 'var(--color-text-muted)'
                    }}
                  >
                    {t('measurements.centimeters')}
                  </button>
                </div>
              </div>

              {/* Grid of 10 Blouse Measurements */}
              <div className="measurements-grid">
                <div className="measurement-field">
                  <label className="field-label">{t('measurements.fields.bust')} ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.bust}
                    onChange={(e) => handleChange('bust', e.target.value)}
                    className="input-styled"
                  />
                </div>
                <div className="measurement-field">
                  <label className="field-label">{t('measurements.fields.underBust')} ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.underBust}
                    onChange={(e) => handleChange('underBust', e.target.value)}
                    className="input-styled"
                  />
                </div>
                <div className="measurement-field">
                  <label className="field-label">{t('measurements.fields.waist')} ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.waist}
                    onChange={(e) => handleChange('waist', e.target.value)}
                    className="input-styled"
                  />
                </div>
                <div className="measurement-field">
                  <label className="field-label">{t('measurements.fields.shoulder')} ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.shoulder}
                    onChange={(e) => handleChange('shoulder', e.target.value)}
                    className="input-styled"
                  />
                </div>
                <div className="measurement-field">
                  <label className="field-label">{t('measurements.fields.armhole')} ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.armhole}
                    onChange={(e) => handleChange('armhole', e.target.value)}
                    className="input-styled"
                  />
                </div>
                <div className="measurement-field">
                  <label className="field-label">{t('measurements.fields.sleeveLength')} ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.sleeveLength}
                    onChange={(e) => handleChange('sleeveLength', e.target.value)}
                    className="input-styled"
                  />
                </div>
                <div className="measurement-field">
                  <label className="field-label">{t('measurements.fields.sleeveRound')} ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.sleeveRound}
                    onChange={(e) => handleChange('sleeveRound', e.target.value)}
                    className="input-styled"
                  />
                </div>
                <div className="measurement-field">
                  <label className="field-label">{t('measurements.fields.blouseLength')} ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.blouseLength}
                    onChange={(e) => handleChange('blouseLength', e.target.value)}
                    className="input-styled"
                  />
                </div>
                <div className="measurement-field">
                  <label className="field-label">{t('measurements.fields.frontNeck')} ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.frontNeck}
                    onChange={(e) => handleChange('frontNeck', e.target.value)}
                    className="input-styled"
                  />
                </div>
                <div className="measurement-field">
                  <label className="field-label">{t('measurements.fields.backNeck')} ({unit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={measurements.backNeck}
                    onChange={(e) => handleChange('backNeck', e.target.value)}
                    className="input-styled"
                  />
                </div>
              </div>

              {/* Save Profile Input */}
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="text"
                  placeholder={t('measurements.profileName')}
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="input-styled"
                  style={{ flexGrow: 1, fontSize: '0.85rem' }}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Upload Photo */}
          {method === 'upload' && (
            <div style={{ textAlign: 'center', padding: '30px 20px', border: '2px dashed var(--color-border-gold)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)' }}>
              <Upload size={36} color="var(--color-gold-dark)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
                {isTamil ? 'உங்கள் பழைய பிளவுஸ் அல்லது அளவு சீட்டை புகைப்படம் எடுத்து பதிவேற்றவும்' : 'Upload Existing Perfect-Fit Blouse or Tailor Measurement Slip'}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                {isTamil ? 'எங்கள் தலைமை டெய்லர் உங்கள் பழைய பிளவுஸ் படத்தைப் பார்த்து சரியான அளவுகளை எடுப்பார்.' : 'Our master tailor will analyze the seam lines and dimensions of your sample blouse.'}
              </p>
              <input
                type="file"
                accept="image/*"
                id="modal-sample-photo"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
              <label htmlFor="modal-sample-photo" className="btn btn-primary">
                <span>{isTamil ? 'புகைப்படம் தேர்ந்தெடுக்கவும்' : 'Select Photo / Slip'}</span>
              </label>
              {sampleBlousePhoto && (
                <div style={{ marginTop: '16px' }}>
                  <img src={sampleBlousePhoto} alt="Sample slip" style={{ maxHeight: '140px', margin: '0 auto', borderRadius: 6 }} />
                  <p style={{ color: 'var(--color-success)', fontSize: '0.82rem', fontWeight: 600, marginTop: 4 }}>
                    ✓ {isTamil ? 'புகைப்படம் வெற்றிகரமாக பதிவேற்றப்பட்டது' : 'Image Uploaded Successfully'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Submit Later */}
          {method === 'later' && (
            <div style={{ background: 'var(--color-gold-subtle)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-gold)' }}>
              <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
                {isTamil ? 'கவலையின்றி ஆர்டர் செய்யுங்கள்!' : 'Order Now, Share Measurements Comfortably'}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                {isTamil
                  ? 'நீங்கள் இப்போது ஆர்டரை பதிவு செய்யலாம். எங்கள் வாடிக்கையாளர் சேவை குழு உங்களை வாட்ஸ்அப் அல்லது போன் மூலம் தொடர்பு கொண்டு உங்கள் வசதிக்கேற்ப அளவுகளைப் பெற்றுக் கொள்வர்.'
                  : 'You can proceed to place your order now to lock in your fabrication slot. Our tailoring master will reach out via WhatsApp/Phone at your preferred time.'}
              </p>
            </div>
          )}

          {/* Tab 4: Video Call */}
          {method === 'videocall' && (
            <div style={{ background: 'var(--color-primary-subtle)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-light)' }}>
              <h4 style={{ color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
                {isTamil ? 'இலவச வீடியோ அளவீடு ஆலோசனை' : 'Complimentary Video Consultation with Master Tailor'}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                {isTamil
                  ? 'வீட்டிலிருந்தபடியே ஒரு டேப் மூலம் சரியான அளவு எடுப்பது எப்படி என்பதை எங்கள் மூத்த பெண் டெய்லர் 1-க்கு-1 வீடியோ காலில் வழிகாட்டுவார்.'
                  : 'Our experienced senior woman tailor will guide you step-by-step over a 10-minute private WhatsApp video call to guarantee a regal silhouette.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="admin-modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            {t('common.cancel')}
          </button>
          <button onClick={handleConfirm} className="btn btn-gold">
            <CheckCircle size={16} />
            <span>{t('measurements.confirmMeasurements')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
