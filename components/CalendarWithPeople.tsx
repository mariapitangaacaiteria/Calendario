'use client';

import React, { useMemo, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { ContinuousCalendar, PersonInfo } from './ContinuousCalendar';

type Props = {
  peopleByDate: Record<string, PersonInfo[]>;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'md' | 'lg' | 'xl';
};

export default function CalendarWithPeople({ peopleByDate, theme = 'auto', size = 'lg' }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<PersonInfo[]>([]);
  const [activePerson, setActivePerson] = useState<PersonInfo | null>(null);

  const title = useMemo(() => {
    if (!selectedDate) return '';
    const [y, m, d] = selectedDate.split('-').map(Number);
    const monthNames = [
      'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
      'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
    ];
    return `${String(d).padStart(2,'0')} de ${monthNames[m-1]} de ${y}`;
  }, [selectedDate]);

  const handleSelectDate = (iso: string, people: PersonInfo[]) => {
    if (people.length === 0) return; // só abre quando tem pessoas
    setSelectedDate(iso);
    setSelectedPeople(people);
    setActivePerson(people[0] ?? null);
    setOpen(true);
  };

  return (
    <>
      <ContinuousCalendar
        size={size}
        theme={theme}
        peopleByDate={peopleByDate}
        onSelectDate={handleSelectDate}
      />

      <Transition show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)} className="relative z-[10000]">
          <Transition.Child as={Fragment} enter="ease-out duration-150" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-150" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-100" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel  className="
    w-full max-w-[95vw] md:max-w-4xl
    h-[92vh] md:h-auto
    overflow-hidden md:overflow-visible
    rounded-none md:rounded-2xl
    bg-white dark:bg-slate-900 shadow-xl ring-1 ring-black/5
  ">
                <div className="flex h-full md:h-auto flex-col md:flex-row">
  {/* esquerda: avatares */}
  <div className="md:w-2/5 p-4 sm:p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
    <Dialog.Title className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
      {title || 'Pessoas neste dia'}
    </Dialog.Title>
    <ul className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {selectedPeople.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            onClick={() => setActivePerson(p)}
            className={[
              'group w-full rounded-2xl p-2 border text-center transition-all',
              activePerson?.id === p.id
                ? 'border-cyan-500 ring-2 ring-cyan-400'
                : 'border-slate-200 hover:border-cyan-300 dark:border-slate-700',
            ].join(' ')}
            aria-label={`Selecionar ${p.name}`}
          >
            <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              {p.avatarUrl ? (
                <Image src={p.avatarUrl} alt={p.name} width={56} height={56} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs sm:text-sm font-semibold text-slate-500">
                  {p.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                </div>
              )}
            </div>
            <div className="mt-2 line-clamp-2 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200">
              {p.name}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
              {p.role || '—'}
            </div>
          </button>
        </li>
      ))}
    </ul>
  </div>

  {/* direita: detalhes */}
  <div className="md:w-3/5 p-4 sm:p-6 overflow-y-auto">
    {activePerson ? (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            {activePerson.avatarUrl ? (
              <Image src={activePerson.avatarUrl} alt={activePerson.name} width={64} height={64} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-sm sm:text-base font-semibold text-slate-500">
                {activePerson.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold truncate">{activePerson.name}</h3>
            <p className="text-xs sm:text-sm text-slate-500">{activePerson.role || '—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <InfoRow label="Tarefa" value={activePerson.task} />
          <InfoRow label="E-mail" value={activePerson.email} />
          <InfoRow label="Telefone" value={activePerson.phone} />
          <InfoRow label="Observações" value={activePerson.notes} className="sm:col-span-2" />
        </div>

        <div className="mt-2 sm:mt-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Fechar
          </button>
        </div>
      </div>
    ) : (
      <p className="text-slate-500">Selecione um funcionário à esquerda.</p>
    )}
  </div>
</div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function InfoRow({ label, value, className }: { label: string; value?: string; className?: string }) {
  return (
    <div className={className}>
      <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
      <div className="mt-1 text-sm text-slate-800 dark:text-slate-100">{value || '—'}</div>
    </div>
  );
}
