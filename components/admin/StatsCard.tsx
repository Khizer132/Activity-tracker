export default function StatsCard({ title, value }: { title: string; value: number }) {
  return (

    <div className="rounded-lg border border-green-200 bg-white p-4">
        <h3 className="text-sm font-medium text-green-600">{title}</h3>
        <p className="mt-2 text-2xl font-bold text-green-800">{value}</p>
    </div>
    
  );
}