import { ArrowRight, Droplets, Heart, Repeat2 } from 'lucide-react';
import { useState } from 'react';
import bloodNetwork from '../assets/network/blood.png';
import donorNetwork from '../assets/network/donor.png';
import thalNetwork from '../assets/network/thal.png';

type Props = {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: 'blood' | 'donor' | 'thal';
  onOpen: () => void;
};

const icons = { blood: Droplets, donor: Heart, thal: Heart };

const photos = {
  blood: bloodNetwork,
  donor: donorNetwork,
  thal: thalNetwork
};

const photoCredits = { blood: 'Blood Bridge visual', donor: 'Blood Bridge visual', thal: 'Blood Bridge visual' };

export default function CardFlip({ title, subtitle, description, features, icon, onOpen }: Props) {
  const [flipped, setFlipped] = useState(false);
  const Icon = icons[icon];
  return (
    <div className="bb-card-flip" onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)} onClick={() => setFlipped(v => !v)}>
      <div className={`bb-card-flip-inner ${flipped ? 'is-flipped' : ''}`}>
        <div className="bb-flip-face bb-flip-front">
          <div className="bb-flip-photo" style={{ backgroundImage: `linear-gradient(180deg, rgba(25,18,19,.02), rgba(25,18,19,.24)), url(\"${photos[icon]}\")` }} />
          <div className="bb-flip-photo-credit">{photoCredits[icon]}</div>
          <div className={`bb-flip-glow ${icon}`} />
          <div className="bb-flip-orbit" />
          <div className="bb-flip-icon"><Icon /></div>
          <div className="bb-flip-content">
            <div><span className="eyebrow">BLOOD BRIDGE</span><h3>{title}</h3><p>{subtitle}</p></div>
            <Repeat2 size={17} className="bb-repeat" />
          </div>
        </div>
        <div className="bb-flip-face bb-flip-back">
          <span className="eyebrow">HOW IT HELPS</span>
          <h3>{title}</h3>
          <p>{description}</p>
          <div className="bb-flip-features">{features.map((feature, i) => <span key={i}><ArrowRight size={13} />{feature}</span>)}</div>
          <button className="bb-flip-open" onClick={e => { e.stopPropagation(); onOpen(); }}>Open module <ArrowRight size={15} /></button>
        </div>
      </div>
    </div>
  );
}
