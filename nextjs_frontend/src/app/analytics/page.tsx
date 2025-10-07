import AnalyticsCards from "@/components/AnalyticsCards";

export default function AnalyticsPage() {
  return (
    <section aria-label="Analytics" className="space-y-4">
      <div className="rounded-xl gradient-bg p-6 card">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">Insights into learning progress and engagement.</p>
      </div>
      <AnalyticsCards />
    </section>
  );
}
