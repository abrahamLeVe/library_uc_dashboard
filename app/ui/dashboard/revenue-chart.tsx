import { fetchLibrosPorMes } from "@/app/lib/data";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { nunito } from "../fonts";

type LibrosPorMesItem = {
  mes: number; // 1..12
  anio: number;
  total: number | string;
};

const MONTH_NAMES_SHORT = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function last12Months() {
  const out: { mes: number; anio: number; label: string }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      mes: d.getMonth() + 1,
      anio: d.getFullYear(),
      label: `${MONTH_NAMES_SHORT[d.getMonth()]}`,
    });
  }
  return out;
}

export default async function LibrosChart() {
  const raw: LibrosPorMesItem[] = await fetchLibrosPorMes();

  // Normalizar: convertir total a number y crear lookup por mes+anio
  const lookup = new Map<string, number>();
  raw.forEach((r) => {
    const key = `${Number(r.anio)}-${Number(r.mes)}`;
    lookup.set(key, Number(r.total ?? 0));
  });

  // Construir array de los últimos 12 meses con totals (0 si no hay)
  const months = last12Months().map((m) => {
    const key = `${m.anio}-${m.mes}`;
    return {
      ...m,
      total: lookup.get(key) ?? 0,
    };
  });

  if (!months || months.length === 0) {
    return <p className="mt-4 text-gray-400">No hay datos disponibles.</p>;
  }

  const maxValue = Math.max(...months.map((m) => m.total), 1); // al menos 1 para evitar div/0
  const chartHeight = 350;

  // 🔥 Etiquetas del eje Y ajustadas para terminar en el máximo real
  const divisions = Math.min(maxValue, 5); // máx 5 divisiones
  const step = Math.max(1, Math.floor(maxValue / divisions));
  const yAxisLabels = Array.from({ length: divisions + 1 }, (_, i) => {
    const val = i * step;
    return val > maxValue ? maxValue : val;
  });
  if (yAxisLabels[yAxisLabels.length - 1] !== maxValue) {
    yAxisLabels[yAxisLabels.length - 1] = maxValue; // asegurar último = maxValue
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${nunito.className} mb-4 text-xl md:text-2xl`}>
        Libros añadidos (últimos 12 meses)
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          {/* Eje Y */}
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label, i) => (
              <p key={label + i}>{label}</p>
            ))}
          </div>

          {/* Barras */}
          {months.map((m) => (
            <div key={`${m.anio}-${m.mes}`} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-green-400 transition-all"
                style={{
                  height: `${(chartHeight / maxValue) * Number(m.total)}px`,
                  minHeight: "2px",
                  width: "14px",
                }}
                title={`${m.label} ${m.anio}: ${m.total}`}
                role="img"
                aria-label={`${m.total} libros en ${m.label} ${m.anio}`}
              />
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Últimos 12 meses</h3>
        </div>
      </div>
    </div>
  );
}
