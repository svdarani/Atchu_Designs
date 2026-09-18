import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Scissors, Sparkles, Sliders, Store } from 'lucide-react';

export default function TrustBadges() {
  const { t } = useLanguage();

  const badges = [
    {
      icon: <Scissors size={24} />,
      title: t('trust.customFitTitle'),
      desc: t('trust.customFitDesc')
    },
    {
      icon: <Sparkles size={24} />,
      title: t('trust.handcraftedAariTitle'),
      desc: t('trust.handcraftedAariDesc')
    },
    {
      icon: <Sliders size={24} />,
      title: t('trust.personalizedDesignTitle'),
      desc: t('trust.personalizedDesignDesc')
    },
    {
      icon: <Store size={24} />,
      title: t('trust.onlineOfflineTitle'),
      desc: t('trust.onlineOfflineDesc')
    }
  ];

  return (
    <section className="trust-bar">
      <div className="container">
        <div className="trust-grid">
          {badges.map((b, i) => (
            <div key={i} className="trust-card">
              <div className="trust-icon-box">{b.icon}</div>
              <div>
                <h3 className="trust-title">{b.title}</h3>
                <p className="trust-desc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
