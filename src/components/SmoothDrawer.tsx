import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, BellRing, HandHeart, ScanLine, X } from 'lucide-react';
import { useState } from 'react';

type Props = {
  onRequest: () => void;
  onDonor: () => void;
};

export default function SmoothDrawer({ onRequest, onDonor }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const go = (action: () => void) => { close(); window.setTimeout(action, 220); };

  return (
    <>
      <button className="drawer-trigger" onClick={() => setOpen(true)}>
        <BellRing size={16} /> Emergency actions <ArrowRight size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
            <motion.aside
              className="smooth-drawer"
              initial={{ y: '100%', opacity: 0, rotateX: 5 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: '100%', opacity: 0, rotateX: 5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="drawer-close" onClick={close} aria-label="Close"><X size={18} /></button>
              <div className="drawer-kicker">BLOOD BRIDGE • QUICK ACTIONS</div>
              <h2>What do you need right now?</h2>
              <p>Choose an urgent pathway. The same saved-form and alert workflow opens from here.</p>
              <div className="drawer-actions">
                <button onClick={() => go(onRequest)}>
                  <span className="drawer-icon emergency"><ScanLine /></span>
                  <span><b>Request blood</b><small>Create an emergency blood request</small></span>
                  <ArrowRight />
                </button>
                <button onClick={() => go(onDonor)}>
                  <span className="drawer-icon donor"><HandHeart /></span>
                  <span><b>Become a donor</b><small>Join emergency and support alerts</small></span>
                  <ArrowRight />
                </button>
              </div>
              <div className="drawer-foot"><span className="drawer-live-dot" /> Blood-group matching • consent-first alerts</div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
