import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Scissors, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CraftsmanshipSection() {
  const { isTamil } = useLanguage();

  return (
    <section className="section-padding" style={{ background: '#FAF5ED', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-48)', alignItems: 'center' }}>
          {/* Left: Rich Visual Montage */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '2px solid var(--color-gold)' }}>
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
                alt="Aari Hand Embroidery Artisans"
                style={{ width: '100%', height: '440px', objectFit: 'cover' }}
              />
            </div>
            {/* Floating Experience Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '20px',
                background: 'var(--color-primary-dark)',
                color: '#FFFFFF',
                padding: '16px 24px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-gold)',
                boxShadow: 'var(--shadow-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Scissors size={28} color="var(--color-gold)" />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-gold-light)', lineHeight: 1.1 }}>15+ Years</div>
                <div style={{ fontSize: '0.75rem', color: '#D4C9BC' }}>{isTamil ? 'கைவினைத் தையல் பாரம்பரியம்' : 'Artisanal Tailoring Mastery'}</div>
              </div>
            </div>
          </div>

          {/* Right: Heritage Narrative */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={16} color="var(--color-gold-dark)" />
              <span className="section-eyebrow">
                {isTamil ? 'எங்கள் தையல் கலை' : 'Heritage & Craftsmanship'}
              </span>
            </div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>
              {isTamil
                ? 'அசல் தம்பூர் ஊசி & தூய சர்தோசி வேலைப்பாடு'
                : 'Sacred Tamboor Needlework & Royal Zardosi'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '24px', fontSize: '1rem' }}>
              {isTamil
                ? 'ஒவ்வொரு மணப்பெண் பிளவுஸும் வெறும் ஆடை மட்டுமல்ல; அது பல தலைமுறைகளாக போற்றிப் பாதுகாக்கப்படும் கலைப்படைப்பு. மதுரையின் புகழ்பெற்ற ஆரி கலைஞர்கள் அசல் ஆன்டிக் ஜரி நூல்கள், கட் பீட்ஸ், குந்தன் மற்றும் பிரெஞ்ச் நாட் நுட்பங்களால் ஒவ்வொரு பிளவுஸையும் உருவாக்குகின்றனர்.'
                : 'Every wedding blouse we stitch is more than apparel—it is a cherished bridal heirloom. Hand-stretched upon wooden khatiya frames, our master artisans weave thousands of microscopic knots using traditional wooden-handled tamboor needles with real copper-wound antique gold wires and luminous stones.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 3 }} />
                <div>
                  <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.95rem' }}>
                    {isTamil ? '2-இன்ச் கூடுதல் ஆல்டரேஷன் மார்ஜின்' : 'Generous 2-Inch Alteration Seams'}
                  </strong>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {isTamil ? 'எதிர்காலத்தில் உடலமைப்பு மாறினாலும் எளிதில் பிரித்து சரிசெய்யும் வசதி.' : 'Ample interior seam margins allow stress-free resizing for years to come.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 3 }} />
                <div>
                  <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.95rem' }}>
                    {isTamil ? 'பிரீமியம் காட்டன் டபுள் லைனிங்' : 'Preshrunk Cotton Double Lining'}
                  </strong>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {isTamil ? 'சருமத்திற்கு உறுத்தாத மென்மையான மற்றும் உறுதியான உள் துணி.' : 'Soft against delicate skin, preventing needle prick irritation and ensuring long-day comfort.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <ShieldCheck size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 3 }} />
                <div>
                  <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.95rem' }}>
                    {isTamil ? 'தலைமை டெய்லர் நேரடி மேற்பார்வை' : 'Master Tailor Fitting Inspection'}
                  </strong>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {isTamil ? 'ஒவ்வொரு தையலும் டெலிவரிக்கு முன் 7-அம்ச தரப் பரிசோதனைக்கு உட்படுத்தப்படும்.' : 'Every garment passes our 7-point quality checklist before being steamed and dispatched.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
