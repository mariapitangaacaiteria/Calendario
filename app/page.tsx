import CalendarWithPeople from '@/components/CalendarWithPeople';

const peopleByDate = {
  // ISO: YYYY-MM-DD
  '2025-11-28': [
    {
      id: 'p1',
      name: 'Ana Souza',
      role: 'Vendas',
      task: 'Reunião com cliente (ACME)',
      email: 'ana@mariapitanga.com',
      phone: '(85) 99999-0001',
      avatarUrl: 'https://i.pravatar.cc/100?img=5',
      notes: 'Levar proposta atualizada; foco em upsell.',
    },
    {
      id: 'p2',
      name: 'Carlos Lima',
      role: 'Suporte',
      task: 'Plantão N2',
      email: 'carlos@mariapitanga.com',
      phone: '(85) 99999-0002',
      avatarUrl: 'https://i.pravatar.cc/100?img=12',
    },
  ],
  '2025-10-30': [
    {
      id: 'p3',
      name: 'Marina Castro',
      role: 'Marketing',
      task: 'Lançamento campanha Q4',
      email: 'marina@mariapitanga.com',
      phone: '(85) 99999-0003',
      avatarUrl: 'https://i.pravatar.cc/100?img=32',
      notes: 'Aprovação de peças às 14h.',
    },
  ],
};

export default function Page() {
  return (
    <main className="px-3 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        <section className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-white shadow-sm">
          <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">Claro</h2>
          <CalendarWithPeople theme="light" peopleByDate={peopleByDate} />
        </section>

        <section className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-slate-950/5">
          <div className="dark">
            <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-slate-100">Escuro</h2>
            <div className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-slate-900">
              <CalendarWithPeople theme="dark" peopleByDate={peopleByDate} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
