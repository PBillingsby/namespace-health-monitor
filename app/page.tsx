import NamespaceHealthMonitor from "./components/NamespaceHealthMonitor";

export default function Home() {
  return (
    <main className="min-h-screen font-mono bg-gray-950 text-white p-2 sm:p-6 w-full">
      <div className="flex flex-row gap-2 justify-center items-center mb-4">
        <img src="/celestia.svg" className="w-8 h-8 sm:w-10 sm:h-10" />
        <h1 className="text-xl sm:text-3xl font-bold">
          Namespace Health Monitor
        </h1>
      </div>
      <div className="w-full max-w-full overflow-x-hidden font-mono">
        <NamespaceHealthMonitor />
      </div>
    </main>
  );
}
