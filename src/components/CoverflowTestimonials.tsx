import { Coverflow, CoverflowControls, CoverflowItem } from '@/components/motion-ui/coverflow';

const TESTIMONIALS = [
  {
    quote: 'The emergency request flow makes it clear what information donors need before they respond.',
    name: 'Donor Network Demo',
    role: 'Blood Bridge pilot feedback',
  },
  {
    quote: 'Verified donation records and reminders can make repeat donor coordination much easier.',
    name: 'Partner Portal Demo',
    role: 'Blood bank workflow feedback',
  },
  {
    quote: 'Thalassemia support alerts give partner centres a focused way to coordinate recurring requirements.',
    name: 'Support Centre Demo',
    role: 'Thalassemia workflow feedback',
  },
];

export default function CoverflowTestimonials() {
  const items = TESTIMONIALS.map((t, index) => (
    <CoverflowItem
      key={t.name}
      label={`Testimonial ${index + 1} of ${TESTIMONIALS.length}`}
    >
      <figure className="flex min-h-[190px] w-full flex-col justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-left shadow-2xl shadow-black/20 backdrop-blur-md sm:min-h-[205px] sm:p-8">
        <div>
          <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Blood Bridge perspective
          </div>
          <blockquote className="text-pretty text-lg font-medium leading-8 text-white sm:text-xl">
            “{t.quote}”
          </blockquote>
        </div>
        <figcaption className="text-sm text-slate-400">
          <span className="font-semibold text-slate-200">{t.name}</span>
          <span className="mx-2 text-slate-600">•</span>
          {t.role}
        </figcaption>
      </figure>
    </CoverflowItem>
  ));

  return (
    <section className="border-t border-slate-900 bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">Designed around real workflows</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Built for donors, hospitals and support centres</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Swipe or use the controls to explore the Blood Bridge workflow perspectives.</p>
        </div>

        <Coverflow
          items={items}
          rotation={22}
          aria-label="Blood Bridge workflow perspectives, use the arrow keys to navigate"
        >
          <CoverflowControls
            announce={(i, total) => `Showing perspective ${i + 1} of ${total}: ${TESTIMONIALS[i].name}`}
            prevLabel="Previous perspective"
            nextLabel="Next perspective"
            dotsLabel="Choose a perspective"
          />
        </Coverflow>
      </div>
    </section>
  );
}
