'use client';

import { useState } from 'react';
import { BarChart3, LineChart } from 'lucide-react';
import { PanelHeader } from './PortalUI';

const financeData = [
  { month: 'Fev', income: 3100, expense: 2380 },
  { month: 'Mar', income: 3550, expense: 2610 },
  { month: 'Abr', income: 3420, expense: 2790 },
  { month: 'Mai', income: 3900, expense: 2860 },
  { month: 'Jun', income: 3760, expense: 2490 },
  { month: 'Jul', income: 4000, expense: 2565 },
];

const chartMaximum = 4500;
const chartWidth = 600;
const chartHeight = 190;
const horizontalPadding = 28;

function linePoints(key: 'income' | 'expense') {
  return financeData
    .map((item, index) => {
      const x = horizontalPadding + index * ((chartWidth - horizontalPadding * 2) / (financeData.length - 1));
      const y = chartHeight - (item[key] / chartMaximum) * (chartHeight - 24);
      return `${x},${y}`;
    })
    .join(' ');
}

function currency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
}

export function FinanceTrendChart() {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const incomeTotal = financeData.reduce((total, item) => total + item.income, 0);
  const expenseTotal = financeData.reduce((total, item) => total + item.expense, 0);

  return (
    <article className="portal-panel finance-trend">
      <PanelHeader
        eyebrow="Últimos 6 meses"
        title="Fluxo financeiro mensal"
        action={
          <div className="finance-trend__controls">
            <div className="finance-trend__view-switch" aria-label="Tipo de gráfico">
              <button type="button" aria-label="Exibir gráfico de barras" aria-pressed={chartType === 'bar'} onClick={() => setChartType('bar')}>
                <BarChart3 size={14} /> Barras
              </button>
              <button type="button" aria-label="Exibir gráfico de linhas" aria-pressed={chartType === 'line'} onClick={() => setChartType('line')}>
                <LineChart size={14} /> Linhas
              </button>
            </div>
            <select aria-label="Ano do gráfico"><option>2026</option></select>
          </div>
        }
      />

      {chartType === 'bar' ? (
        <div className="finance-trend__bars" role="img" aria-label="Comparação mensal entre entradas e saídas">
          {financeData.map((item) => (
            <div className="finance-trend__bar-group" key={item.month}>
              <div className="finance-trend__bar-pair">
                <span className="is-income" style={{ height: `${(item.income / chartMaximum) * 100}%` }} title={`Entradas: ${currency(item.income)}`} />
                <span className="is-expense" style={{ height: `${(item.expense / chartMaximum) * 100}%` }} title={`Saídas: ${currency(item.expense)}`} />
              </div>
              <small>{item.month}</small>
            </div>
          ))}
        </div>
      ) : (
        <div className="finance-trend__line" role="img" aria-label="Evolução mensal das entradas e saídas">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" aria-hidden="true">
            {[35, 80, 125, 170].map((y) => <line key={y} x1="0" x2={chartWidth} y1={y} y2={y} className="finance-trend__grid-line" />)}
            <polyline points={linePoints('income')} className="finance-trend__line-income" />
            <polyline points={linePoints('expense')} className="finance-trend__line-expense" />
            {financeData.map((item, index) => {
              const x = horizontalPadding + index * ((chartWidth - horizontalPadding * 2) / (financeData.length - 1));
              return (
                <g key={item.month}>
                  <circle cx={x} cy={chartHeight - (item.income / chartMaximum) * (chartHeight - 24)} r="4" className="finance-trend__dot-income" />
                  <circle cx={x} cy={chartHeight - (item.expense / chartMaximum) * (chartHeight - 24)} r="4" className="finance-trend__dot-expense" />
                </g>
              );
            })}
          </svg>
          <div className="finance-trend__months">{financeData.map((item) => <small key={item.month}>{item.month}</small>)}</div>
        </div>
      )}

      <div className="finance-trend__footer">
        <div className="finance-trend__legend">
          <span><i className="is-income" /> Entradas <strong>{currency(incomeTotal)}</strong></span>
          <span><i className="is-expense" /> Saídas <strong>{currency(expenseTotal)}</strong></span>
        </div>
        <span>Saldo no período <strong>{currency(incomeTotal - expenseTotal)}</strong></span>
      </div>
    </article>
  );
}
