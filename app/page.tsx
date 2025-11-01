'use client';

import { useEffect, useState } from 'react';
import CalendarWithPeople from '@/components/CalendarWithPeople';

const peopleByDate = {
  '2025-10-28': [
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

type Mode = 'light' | 'dark';

export default function Page() {
  const [mode, setMode] = useState<Mode>('light');

  // carrega preferência salva (opcional)
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('calendar-theme') as Mode | null) : null;
    if (saved === 'light' || saved === 'dark') setMode(saved);
  }, []);

  // salva preferência ao mudar
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('calendar-theme', mode);
  }, [mode]);

  const toggleMode = () => setMode(m => (m === 'light' ? 'dark' : 'light'));

  return (
<<<<<<< HEAD
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-slate-800 dark:text-slate-100">
          Calendário Contínuo
        </h1>
        <ContinuousCalendar theme="auto" />
      </div>
=======
    <main className="px-3 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* barra topo com toggle */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Continuous Calendar</h1>
        <button
          type="button"
          onClick={toggleMode}
          className="
            inline-flex items-center gap-2 rounded-xl border border-slate-300
            bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50
            dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/80
          "
          aria-label={`Ativar modo ${mode === 'light' ? 'escuro' : 'claro'}`}
          title={`Trocar para modo ${mode === 'light' ? 'escuro' : 'claro'}`}
        >
          {mode === 'light' ? (
            <>
              {/* ícone lua */}
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                <path d="M21 12.79A9 9 0 0 1 11.21 3c-.36 0-.71.02-1.06.07a.75.75 0 0 0-.32 1.36A7.5 7.5 0 1 0 19.57 14.17a.75.75 0 0 0 1.36-.32c.05-.35.07-.7.07-1.06Z" />
              </svg>
              Escuro
            </>
          ) : (
            <>
              {/* ícone sol */}
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM3 11a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm16 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1ZM5.64 4.64a1 1 0 0 1 1.41 0l.71.7a1 1 0 0 1-1.41 1.42l-.71-.71a1 1 0 0 1 0-1.41Zm10.6 10.6a1 1 0 0 1 1.41 0l.71.71a1 1 0 0 1-1.41 1.41l-.71-.7a1 1 0 0 1 0-1.42Zm0-9.19a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1-1.41 1.41l-.71-.71ZM5.64 18.36a1 1 0 0 1 1.41 0l.71.71a1 1 0 1 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41Z" />
              </svg>
              Claro
            </>
          )}
        </button>
      </div>

      {/* cartão único com calendário que muda de tema */}
      <section
        className={
          mode === 'dark'
            ? 'rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-slate-900'
            : 'rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-white shadow-sm'
        }
      >
        {/* Passa o tema para o componente; ele já aplica a classe `dark` internamente quando theme="dark" */}
        <CalendarWithPeople theme={mode} peopleByDate={peopleByDate} />
      </section>
>>>>>>> 3dc61e7d0b539c60c16d1a0df8f6c85af825f96c
    </main>
  );
}
