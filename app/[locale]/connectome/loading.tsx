export default function ConnectomeLoading() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-zinc-800 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-blue-500/60 animate-ping" />
        </div>
        <div className="h-4 w-32 bg-zinc-800 rounded mx-auto mb-2" />
        <div className="h-3 w-48 bg-zinc-800/60 rounded mx-auto" />
      </div>
    </main>
  );
}
