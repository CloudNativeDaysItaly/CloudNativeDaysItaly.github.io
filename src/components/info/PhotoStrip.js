// Banda foto a tutta larghezza su fondo magenta: unico uso del magenta
// come sfondo di banda (solo immagini, nessun testo), rompe la sequenza
// di due sezioni bianche adiacenti in home.
export default function PhotoStrip({ data }) {
  if (!data?.active || !data.images?.length) return null;

  return (
    <section className='bg-brand-magenta py-10 lg:py-14' aria-label='Event photos'>
      <div className='mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-6 sm:grid-cols-3'>
        {data.images.map((image, i) => (
          <div key={`${image.src}-${i}`} className={`card-pop relative overflow-hidden p-2 ${i % 2 ? '-rotate-1' : 'rotate-1'}`}>
            <img
              src={image.src}
              alt={image.alt}
              loading='lazy'
              className='aspect-[4/3] w-full object-cover'
            />
            {image.year && (
              <span className='absolute left-4 top-4 border-pop border-ink bg-white px-2 py-0.5 text-xs font-bold uppercase text-ink'>
                {image.year}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
