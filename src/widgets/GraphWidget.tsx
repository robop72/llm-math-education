import React, { useEffect, useRef } from 'react';

declare global { interface Window { Desmos: any; } }

export interface GraphWidgetProps {
  expressions: string[];   // one or more LaTeX expressions
  label?: string;
}

const DESMOS_SRC = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export default function GraphWidget({ expressions, label }: GraphWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<any>(null);

  const isDark = document.documentElement.classList.contains('dark');
  const bgColor   = isDark ? '#111827' : '#ffffff';
  const textColor = isDark ? '#e5e7eb' : '#111827';
  const gridColor = isDark ? '#374151' : '#d1d5db';

  useEffect(() => {
    function init() {
      if (!containerRef.current || !window.Desmos) return;
      calculatorRef.current?.destroy();

      const calc = window.Desmos.GraphingCalculator(containerRef.current, {
        expressions: false,
        settingsMenu: false,
        zoomButtons: true,
        border: false,
        backgroundColor: bgColor,
        textColor,
        gridColor,
        axisColor: gridColor,
      });

      expressions.forEach((expr, i) => {
        calc.setExpression({
          id: `e${i}`,
          latex: expr.trim(),
          color: COLORS[i % COLORS.length],
        });
      });

      calculatorRef.current = calc;
    }

    if (window.Desmos) {
      init();
    } else {
      let script = document.querySelector<HTMLScriptElement>('script[src*="desmos"]');
      if (!script) {
        script = document.createElement('script');
        script.src = DESMOS_SRC;
        document.head.appendChild(script);
      }
      script.addEventListener('load', init);
    }

    return () => { calculatorRef.current?.destroy(); };
  }, [expressions.join(','), bgColor]);

  const displayLabel = label ?? expressions.join(', ');

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <span className="text-sm">📈</span>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 font-mono">{displayLabel}</span>
      </div>
      <div ref={containerRef} style={{ height: 280, width: '100%' }} />
    </div>
  );
}
