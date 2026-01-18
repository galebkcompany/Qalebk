export default function Card({ title, value, subtitle }: { title: string, value: string | number, subtitle?: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <span className="text-gray-500 text-sm">{title}</span>
      <span className="text-2xl font-bold">{value}</span>
      {subtitle && <span className="text-gray-400 text-xs">{subtitle}</span>}
    </div>
  )
}
