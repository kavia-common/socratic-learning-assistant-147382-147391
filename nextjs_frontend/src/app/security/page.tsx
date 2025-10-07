export default function SecurityPage() {
  return (
    <section aria-label="Security" className="space-y-4">
      <div className="rounded-xl gradient-bg p-6 card">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Security</h1>
        <p className="mt-2 text-gray-600">
          Frontend follows secure defaults: safe storage abstraction, CSRF helper, and input sanitization.
        </p>
      </div>
      <article className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Practices</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Sanitize user input client-side before sending to backend.</li>
          <li>Use secure, minimal localStorage via a wrapper; prefer server sessions.</li>
          <li>CSRF token helper stub for future backend integration.</li>
          <li>Fetch wrapper centralizes error handling and retries.</li>
        </ul>
      </article>
    </section>
  );
}
