import { ContinuousCalendar } from '@/components/ContinuousCalendar';

export default function Page() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-slate-800 dark:text-slate-100">
          Calendário Contínuo
        </h1>
        <ContinuousCalendar theme="auto" />
      </div>
    </main>
  );
}
