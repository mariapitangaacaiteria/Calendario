'use client';

import React from "react";
import { useSnack } from "@/app/SnackProvider";
import { ContinuousCalendar } from "@/components/ContinuousCalendar";

export default function DemoWrapper() {
  const { createSnack } = useSnack();

  const onClickHandler = (day: number, month: number, year: number) => {
    const snackMessage = `Você clicou em ${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
    createSnack(snackMessage, 'success');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-full max-w-[1200px]">
        <ContinuousCalendar onClick={onClickHandler} />
      </div>
    </div>
  );
}
