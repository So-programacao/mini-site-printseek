import { useEffect, useState } from "react";

function App() {
  const [search, setSearch] = useState("");

  // lista fake de imagens (pode trocar depois)
  const items = [
    "https://picsum.photos/300?1",
    "https://picsum.photos/300?2",
    "https://picsum.photos/300?3",
    "https://picsum.photos/300?4",
    "https://picsum.photos/300?5",
    "https://picsum.photos/300?6",
    "https://picsum.photos/300?7",
    "https://picsum.photos/300?8",
    "https://picsum.photos/300?9",
  ];

  // filtro simples (só exemplo)
  const filtered = items.filter((_, i) => i.toString().includes(search));

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <div className="bg-black min-h-screen text-white flex justify-center">
      {/* container mobile */}
      <div className="w-full max-w-sm">
        {/* 🔎 HEADER */}
        <div className="sticky top-0 bg-black p-3 border-b border-zinc-800">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded-lg bg-zinc-900 text-white outline-none"
          />
        </div>

        {/* 🧱 GRID */}
        <div className="p-3 grid grid-cols-2 gap-3">
          {filtered.map((img, index) => (
            <div key={index} className="bg-zinc-900 rounded-lg overflow-hidden">
              <img src={img} alt="item" className="w-full h-40 object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
