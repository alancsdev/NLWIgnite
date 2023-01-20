import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { generateDatesFromYearsBeginning } from '../utils/generate-dates-from-year-beginning';
import { HabitDay } from './HabitDay';

const weekDay = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const summaryDates = generateDatesFromYearsBeginning();

const mimimumSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = mimimumSummaryDatesSize - summaryDates.length;

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([]);

  useEffect(() => {
    api.get('summary').then((response) => {
      setSummary(response.data);
    });
  }, []);

  return (
    <div className="w-full flex">
      {/* Mostra os dias da semana */}
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDay.map((weekDay, i) => {
          return (
            <div
              key={`${weekDay}-${i}`}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
            >
              {weekDay}
            </div>
          );
        })}
      </div>
      {/* Gera os quadrados na tela */}
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summaryDates.map((date) => {
          const dayInSummary = summary.find((day) => {
            return dayjs(date).isSame(day.date, 'day');
          });
          return (
            <HabitDay
              date={date}
              amount={dayInSummary?.amount}
              completed={dayInSummary?.completed}
              key={date.toString()}
            />
          );
        })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, i) => {
            return (
              <div
                className="w-10 h-10 bg-zin-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
                key={i}
              />
            );
          })}
      </div>
    </div>
  );
}
