function Spinner() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-baseline justify-center">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-blue-700 leading-none">K</h1>
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-500 leading-none">i</span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

export default Spinner;