import ChatPanel from "@/components/ChatPanel";

export default function Home() {
  return (
    <section aria-label="Chat" className="space-y-4">
      <div className="rounded-xl gradient-bg p-6 card">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Socratic Learning Assistant
        </h1>
        <p className="mt-2 text-gray-600">
          Engage in guided Socratic dialogue using your uploaded course materials.
        </p>
      </div>
      <ChatPanel />
    </section>
  );
}
