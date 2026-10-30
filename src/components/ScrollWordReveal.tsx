import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

type Props = {
  children: string;
  className?: string;
};

export default function ScrollWordReveal({ children, className = '' }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const words = children.split(' ');

  return (
    <h2 ref={ref} className={`scroll-word-reveal ${className}`}>
      {words.map((word, index) => (
        <span className="scroll-word" key={`${word}-${index}`}>
          <motion.span
            initial={{ opacity: 0, y: 28, filter: 'blur(7px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 28, filter: 'blur(7px)' }}
            transition={{ duration: 0.58, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}
