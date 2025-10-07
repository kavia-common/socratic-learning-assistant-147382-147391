export default function PrivacyPage() {
  return (
    <section aria-label="Privacy Policy" className="space-y-4">
      <div className="rounded-xl gradient-bg p-6 card">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-gray-600">
          We prioritize student privacy and minimize data collection. See details below.
        </p>
      </div>
      <article className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-gray-700">
          This application processes your content to provide Socratic guidance. Data collection is limited
          to what is necessary for feature functionality and analytics. You can control consent and cookies.
        </p>
        <h3 className="text-lg font-semibold">Your Controls</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Cookie preferences via the cookie banner.</li>
          <li>Consent for analytics and processing before using chat.</li>
          <li>Right to request export or deletion (pending backend integration).</li>
        </ul>
        <h3 className="text-lg font-semibold">Data Retention</h3>
        <p className="text-gray-700">
          Session logs and uploads retention policies will be configurable. For now, mock storage in browser.
        </p>
      </article>
    </section>
  );
}
