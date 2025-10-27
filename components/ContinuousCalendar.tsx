'use client';

import React, { useMemo, useRef, useState, useEffect, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export type PersonInfo = {
  id: string;
  name: string;
  role?: string;
  task?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  notes?: string;
};

interface ContinuousCalendarProps {
  onClick?: (_day:number, _month:number, _year:number) => void;
  /** porte visual: md (default) | lg | xl */
  size?: 'md' | 'lg' | 'xl';
  /** tema local: 'light' | 'dark' | 'auto' (herda). default 'auto' */
  theme?: 'light' | 'dark' | 'auto';

  /** pessoas por data ISO (YYYY-MM-DD) */
  peopleByDate?: Record<string, PersonInfo[]>;

  /** dispara ao selecionar um dia (já com ISO e pessoas do dia) */
  onSelectDate?: (iso: string, people: PersonInfo[]) => void;

  /** render extra por dia (opcional) */
  dayExtras?: (args: {
    iso: string;
    isToday: boolean;
    isCurrentMonth: boolean;
    people: PersonInfo[];
  }) => React.ReactNode;
}

export const ContinuousCalendar: React.FC<ContinuousCalendarProps> = ({
  onClick,
  size = 'lg',
  theme = 'auto',
  peopleByDate,
  onSelectDate,
  dayExtras,
}) => {
  // hooks sempre no topo
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState<number>(2000);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const today = new Date();

  useEffect(() => {
    const t = new Date();
    setYear(t.getFullYear());
    setSelectedMonth(t.getMonth());
    setMounted(true);
  }, []);

  const monthOptions = useMemo(
    () => monthNames.map((name, index) => ({ name, value: index })),
    []
  );

  // tamanhos
  const sizes = {
    md: {
      container: 'max-w-[1400px]',
      monthTitle: 'text-2xl sm:text-3xl',
      gridGap: 'gap-3 md:gap-4 2xl:gap-5',
      dayBubble: 'h-9 w-9 md:h-10 md:w-10 text-base md:text-lg',
      cellRadius: 'rounded-2xl',
      navBtnPad: 'p-2',
      navIcon: 'size-5',
      headPadX: 'px-6 md:px-10',
      headPadT: 'pt-6 md:pt-8',
      panelPadX: 'px-5 sm:px-8',
      panelPadT: 'pt-4 sm:pt-6',
    },
    lg: {
      container: 'max-w-[1920px] md:max-w-[90vw]',
      monthTitle: 'text-3xl sm:text-4xl',
      gridGap: 'gap-4 md:gap-5 2xl:gap-6',
      dayBubble: 'h-12 w-12 md:h-14 md:w-14 text-lg md:text-2xl',
      cellRadius: 'rounded-3xl',
      navBtnPad: 'p-3',
      navIcon: 'size-6 md:size-7',
      headPadX: 'px-8 md:px-14',
      headPadT: 'pt-7 md:pt-10',
      panelPadX: 'px-6 sm:px-10 md:px-12',
      panelPadT: 'pt-5 sm:pt-7',
    },
    xl: {
      container: 'max-w-[96vw]',
      monthTitle: 'text-4xl sm:text-5xl',
      gridGap: 'gap-5 md:gap-6 2xl:gap-7',
      dayBubble: 'h-14 w-14 md:h-16 md:w-16 text-2xl md:text-3xl',
      cellRadius: 'rounded-[1.75rem]',
      navBtnPad: 'p-3 md:p-4',
      navIcon: 'size-7 md:size-8',
      headPadX: 'px-10 md:px-16',
      headPadT: 'pt-8 md:pt-12',
      panelPadX: 'px-8 sm:px-12 md:px-16',
      panelPadT: 'pt-6 sm:pt-8',
    },
  }[size];

  // navegação
  const goPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const handleTodayClick = () => {
    const t = new Date();
    setYear(t.getFullYear());
    setSelectedMonth(t.getMonth());
  };

  const handleDayClick = (day: number, month: number, baseYear: number) => {
    if (!onClick) return;
    if (month < 0) onClick(day, 11, baseYear - 1);
    else if (month > 11) onClick(day, 0, baseYear + 1);
    else onClick(day, month, baseYear);
  };

  // matriz 6x7
  const getMonthMatrix = (y: number, m: number) => {
    const firstWeekday = new Date(y, m, 1).getDay(); // 0 = dom
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevMonthDays = new Date(y, m, 0).getDate();

    const leading = firstWeekday;
    const totalCells = 42; // 6 semanas
    const cells: { day: number; month: number }[] = [];

    for (let i = leading; i > 0; i--) cells.push({ day: prevMonthDays - i + 1, month: m - 1 });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, month: m });
    const trailing = totalCells - cells.length;
    for (let d = 1; d <= trailing; d++) cells.push({ day: d, month: m + 1 });

    return cells;
  };

  // painéis dos 12 meses (sempre retorna array)
  const panels = useMemo<JSX.Element[]>(() => {
    if (!mounted) return [];

    return Array.from({ length: 12 }, (_, m) => {
      const cells = getMonthMatrix(year, m);
      return (
        <div
          key={`month-panel-${year}-${m}`}
          className={`min-w-full shrink-0 ${sizes.panelPadX} ${sizes.panelPadT}`}
          aria-label={`${monthNames[m]} de ${year}`}
          role="grid"
          aria-readonly="true"
        >
          <div className={`grid grid-cols-7 ${sizes.gridGap}`}>
            {cells.map(({ day, month }, idx) => {
              const displayYear = month < 0 ? year - 1 : month > 11 ? year + 1 : year;
              const displayMonth = month < 0 ? 11 : month > 11 ? 0 : month;

              const isToday =
                today.getDate() === day &&
                today.getMonth() === displayMonth &&
                today.getFullYear() === displayYear;

              const isCurrentMonth = month === m;

              const iso = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const people = (peopleByDate?.[iso] ?? []);

              const handleClickCell = () => {
                if (onSelectDate) onSelectDate(iso, people);
                handleDayClick(day, month, year);
              };

              return (
                <div
                  key={`cell-${iso}`}
                  onClick={handleClickCell}
                  className={[
                    'relative aspect-square w-full cursor-pointer border transition-all shadow-sm',
                    sizes.cellRadius,
                    isCurrentMonth
                      ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60'
                      : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50',
                    'hover:border-cyan-400 hover:shadow focus:outline-none focus:ring-2 focus:ring-cyan-400',
                  ].join(' ')}
                  role="gridcell"
                  aria-label={`${day} de ${monthNames[displayMonth]} de ${displayYear}`}
                  {...(isToday ? { 'aria-current': 'date' } : {})}
                >
                  {/* número do dia */}
                  <span
                    className={[
                      'absolute left-2 top-2 flex items-center justify-center rounded-full',
                      sizes.dayBubble,
                      isToday ? 'bg-blue-600 font-semibold text-white' : '',
                      isCurrentMonth ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500',
                    ].join(' ')}
                  >
                    {day}
                  </span>

                  {/* badge de contagem */}
                  {people.length > 0 && (
                    <span
                      className="
                        absolute bottom-2 right-2 min-w-6 h-6 px-2 rounded-full
                        flex items-center justify-center text-xs font-semibold
                        bg-cyan-600 text-white shadow-sm
                      "
                      aria-label={`${people.length} pessoa${people.length > 1 ? 's' : ''} marcada${people.length > 1 ? 's' : ''}`}
                    >
                      {people.length}
                    </span>
                  )}

                  {/* extra custom opcional */}
                  {dayExtras?.({ iso, isToday, isCurrentMonth, people })}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  }, [mounted, year, sizes, peopleByDate, onSelectDate]);

  // wrapper opcional para escopo dark local
  const themeWrapperClass = theme === 'dark' ? 'dark' : '';

  // ----------- RENDER -----------
  return (
    <div className={themeWrapperClass}>
      <div
        className={[
          'no-scrollbar calendar-container mx-auto overflow-hidden pb-8 sm:pb-12 shadow-2xl',
          'rounded-2xl sm:rounded-3xl md:rounded-[2rem]',
          'bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100',
          'px-3 sm:px-4',
          sizes.container,
        ].join(' ')}
      >
        {!mounted ? (
          // SKELETON
          <div className="rounded-t-3xl bg-white dark:bg-slate-900 shadow-xl" aria-busy="true" aria-live="polite">
            <div className="p-8">
              <div className="mb-6 h-8 w-64 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header (já inclui o cabeçalho dos dias) */}
            <div className={`sticky -top-px z-50 w-full rounded-t-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur ${sizes.headPadX} ${sizes.headPadT} border-b border-slate-200/70 dark:border-slate-800/70`}>
              <div className="mb-4 sm:mb-6 flex w-full flex-wrap items-center justify-between gap-3 sm:gap-6">
                {/* lado esquerdo: selects + hoje */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <Select
                    name="month"
                    value={selectedMonth}
                    options={monthOptions}
                    onChange={(newMonth) => setSelectedMonth(newMonth)}
                    className="w-36 sm:w-40"
                  />
                  <Select
                    name="year"
                    value={year}
                    options={Array.from({ length: 101 }, (_, i) => {
                      const y = 1950 + i;
                      return { name: `${y}`, value: y };
                    })}
                    onChange={(newYear) => setYear(newYear)}
                    className="w-28 sm:w-36"
                  />
                  <button
                    onClick={handleTodayClick}
                    type="button"
                    className="rounded-xl border border-gray-300 bg-white m-8  px-4 py-2 text-xs sm:text-sm font-medium text-gray-900 hover:bg-gray-100 transition-all
                               dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/80"
                  >
                    Hoje
                  </button>
                </div>

                {/* lado direito: nav + título */}
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 justify-end">
                  <button
                    onClick={goPrevMonth}
                    className={`rounded-full border border-slate-300 ${sizes.navBtnPad} transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 shrink-0`}
                    aria-label="Mês anterior"
                  >
                    <svg className={`${sizes.navIcon} text-slate-800 dark:text-slate-100`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
                    </svg>
                  </button>

                  <h1 className="mx-1 sm:mx-2 truncate text-center font-semibold text-lg sm:text-2xl md:text-3xl">
                    {monthNames[selectedMonth]} {year}
                  </h1>

                  <button
                    onClick={goNextMonth}
                    className={`rounded-full border border-slate-300 ${sizes.navBtnPad} transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 shrink-0`}
                    aria-label="Próximo mês"
                  >
                    <svg className={`${sizes.navIcon} text-slate-800 dark:text-slate-100`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* cabeçalho dos dias */}
              <div className="grid w-full grid-cols-7 text-slate-500 dark:text-slate-400" role="row">
                {daysOfWeek.map((day, i) => (
                  <div
                    key={i}
                    role="columnheader"
                    className="w-full border-b border-slate-200 py-2 sm:py-3 text-center text-[11px] sm:text-sm font-semibold dark:border-slate-700"
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* trilho 12 meses */}
            <div className="relative w-full overflow-hidden">
              <div
                ref={trackRef}
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${selectedMonth * 100}%)` }}
              >
                {panels}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ===================== Select (Headless UI) ===================== */

export interface SelectProps {
  name: string;
  value: number;
  label?: string;
  options: { name: string; value: number }[];
  onChange: (_value: number) => void;
  className?: string;
}

export const Select = ({ name, value, label, options = [], onChange, className }: SelectProps) => {
  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className={`relative ${className ?? ''}`}>
      {label && (
        <label htmlFor={name} className="mb-2 block font-medium text-slate-800 dark:text-slate-100">
          {label}
        </label>
      )}

      <Listbox value={selected?.value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className="
              w-36 sm:w-44 cursor-pointer rounded-3xl border bg-white
              py-2 pl-3 pr-10 text-center text-sm font-medium
              hover:bg-gray-100
              focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400
              sm:py-3 sm:pl-3 sm:pr-12
              transition-all
              border-gray-300 text-gray-900
              dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/80
            "
            aria-label={name}
          >
            <span className="block w-full truncate text-center">{selected?.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 mr-2 flex items-center">
              <svg className="size-5 text-slate-600 dark:text-slate-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Listbox.Options
              className="
                absolute z-50 mt-1 max-h-60 w-56 overflow-auto
                rounded-3xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none
                dark:bg-slate-800 dark:ring-white/5
              "
            >
              {options.map((opt) => (
                <Listbox.Option
                  key={opt.value}
                  value={opt.value}
                  className={({ active, selected }) =>
                    `
                    relative cursor-pointer select-none py-2 px-4 text-center
                    ${active ? 'bg-cyan-50 text-cyan-900 dark:bg-cyan-900/20 dark:text-cyan-200' : 'text-gray-900 dark:text-slate-100'}
                    ${selected ? 'font-semibold' : 'font-normal'}
                  `
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className="block w-full truncate text-center">{opt.name}</span>
                      {selected ? (
                        <span className="absolute inset-y-0 right-2 flex items-center">
                          <svg className="size-4 text-cyan-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path
                              fillRule="evenodd"
                              d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.207 6.793a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L11 12.586l3.793-3.793a1 1 0 0 1 1.414 0Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
