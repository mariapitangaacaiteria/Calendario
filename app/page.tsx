import { ContinuousCalendar } from '@/components/ContinuousCalendar';

export default function Page() {
  return (
    <main className="p-8 grid md:grid-cols-2 gap-12">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Claro</h2>
        <ContinuousCalendar theme="light" />
      </section>
      <section className="bg-slate-950/5 dark:bg-transparent rounded-2xl p-4">
        <h2 className="mb-4 text-xl font-semibold">Escuro</h2>
        <ContinuousCalendar theme="dark" />
      </section>
    </main>
  );
}
