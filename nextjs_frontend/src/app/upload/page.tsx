import UploadPanel from "@/components/UploadPanel";

export default function UploadPage() {
  return (
    <section aria-label="Upload Materials" className="space-y-4">
      <div className="rounded-xl gradient-bg p-6 card">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Upload Materials</h1>
        <p className="mt-2 text-gray-600">Upload PDFs, slides, and notes to power Socratic dialogue.</p>
      </div>
      <UploadPanel />
    </section>
  );
}
