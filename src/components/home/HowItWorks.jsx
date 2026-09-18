import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Compass, Sliders, Ruler, CreditCard, PackageCheck } from 'lucide-react';

export default function HowItWorks() {
  const { isTamil } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: <Compass size={24} />,
      title_en: 'Explore & Select Design',
      title_ta: 'வடிவமைப்பை தேர்ந்தெடுங்கள்',
      desc_en: 'Browse handcrafted bridal collections or upload your personal Instagram reference photo.',
      desc_ta: 'எங்கள் மணப்பெண் கலெக்ஷன்களைப் பாருங்கள் அல்லது உங்கள் சொந்த டிசைன் படத்தை பதிவேற்றுங்கள்.'
    },
    {
      num: '02',
      icon: <Sliders size={24} />,
      title_en: 'Customize Style & Aari',
      title_ta: 'விருப்பப்படி மாற்றுங்கள்',
      desc_en: 'Select neck depth, sleeve length, latkan dori, and embroidery density with transparent pricing.',
      desc_ta: 'கழுத்து மாடல், கை நீளம், லட்கன்ஸ் மற்றும் ஆரி அடர்த்தியை உங்கள் விருப்பப்படி தேர்வு செய்யுங்கள்.'
    },
    {
      num: '03',
      icon: <Ruler size={24} />,
      title_en: 'Provide Measurements',
      title_ta: 'அளவுகளை உள்ளிடுங்கள்',
      desc_en: 'Enter measurements in Inches/CM, upload old blouse photo, or request a tailor video consultation.',
      desc_ta: 'இன்ச்/செ.மீ-ல் அளவுகளை உள்ளிடலாம், பழைய பிளவுஸ் படத்தை பதிவேற்றலாம் அல்லது வீடியோ வழிகாட்டல் பெறலாம்.'
    },
    {
      num: '04',
      icon: <CreditCard size={24} />,
      title_en: 'Secure Online or Offline Pay',
      title_ta: 'பாதுகாப்பான பேமெண்ட்',
      desc_en: 'Pay securely via UPI / Cards or pay advance in cash / bank transfer during walk-in visit.',
      desc_ta: 'UPI அல்லது கார்டு மூலம் செலுத்தலாம் அல்லது கடைக்கு வந்து அட்வான்ஸ் தொகையை செலுத்தலாம்.'
    },
    {
      num: '05',
      icon: <PackageCheck size={24} />,
      title_en: 'Track Progress & Delivery',
      title_ta: 'கண்காணியுங்கள் & டெலிவரி',
      desc_en: 'Watch every milestone from Aari embroidery to tailor QC, dispatched straight to your doorstep.',
      desc_ta: 'ஆரி வேலைப்பாடு முதல் தரப் பரிசோதனை வரை ஒவ்வொரு நிலையையும் அறிந்து பிளவுஸை பெறுங்கள்.'
    }
  ];

  return (
    <section className="section-padding" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">
            {isTamil ? 'எளிய செயல்முறை' : 'Seamless Tailoring Journey'}
          </span>
          <h2 className="section-title">
            {isTamil
              ? 'உங்கள் கனவு பிளவுஸ் உருவாகும் 5 படிகள்'
              : 'How Your Bespoke Blouse Comes to Life'}
          </h2>
          <p className="section-desc">
            {isTamil
              ? 'தேர்வு செய்வது முதல் கைவினை தையல் மற்றும் உங்கள் வீடு வந்து சேரும் வரை எளிமையான வழிமுறை.'
              : 'From your first inspiration to master cutting, Aari needlework and doorstep delivery.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-20)' }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="card-premium"
              style={{ padding: 'var(--space-24)', position: 'relative', display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  fontSize: '1.75rem',
                  fontFamily: 'var(--font-heading-en)',
                  color: 'rgba(197, 160, 89, 0.25)',
                  fontWeight: 700
                }}
              >
                {step.num}
              </div>

              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-primary-subtle)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  border: '1px solid var(--color-border-gold)'
                }}
              >
                {step.icon}
              </div>

              <h3 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
                {isTamil ? step.title_ta : step.title_en}
              </h3>

              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {isTamil ? step.desc_ta : step.desc_en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
