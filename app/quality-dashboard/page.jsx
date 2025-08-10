export default function QualityDashboardPage() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-cyan-800/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-indigo-800/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
      
      <header className="absolute top-10 left-10 text-left">
        <h2 className="text-2xl font-bold tracking-wider">MECHANICAL ERP</h2>
        <p className="text-sm text-gray-400">Project Sentinel</p>
      </header>

      <main>
        <h1 className="text-xl font-semibold">Quality Dashboard</h1>
        {/* Add your quality dashboard content here */}
      </main>

      <footer className="absolute bottom-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Mechanical Industrial Solutions. All rights reserved.
      </footer>
    </div>
  );
}