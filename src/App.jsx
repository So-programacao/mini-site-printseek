import { useEffect, useMemo, useState } from "react";

// Gera itens fake seguindo o mesmo esquema de ids que o bot usa
// (cat_<catIndex>, sub_<catIndex>_<subIndex>, pac_<catIndex>_<subIndex>_<pacIndex>).
// Quando vier do servidor de verdade, troca isso por um fetch que já retorna
// os itens nesse formato (com title, image, catId, subId, pacId, premium).
const generateMockItems = () => {
  const items = [];

  for (let catIndex = 0; catIndex < 6; catIndex++) {
    for (let subIndex = 0; subIndex < 4; subIndex++) {
      for (let pacIndex = 0; pacIndex < 5; pacIndex++) {
        const catId = `cat_${catIndex}`;
        const subId = `sub_${catIndex}_${subIndex}`;
        const pacId = `pac_${catIndex}_${subIndex}_${pacIndex}`;

        // cada pacote tem algumas imagens dentro
        for (let imgIndex = 0; imgIndex < 4; imgIndex++) {
          items.push({
            id: `${pacId}_${imgIndex}`,
            image: `https://picsum.photos/seed/${pacId}-${imgIndex}/300/300`,
            title: `Pacote ${catIndex}.${subIndex}.${pacIndex} - Foto ${imgIndex + 1}`,
            catId,
            subId,
            pacId,
            premium: (catIndex + subIndex + pacIndex + imgIndex) % 3 === 0,
          });
        }
      }
    }
  }

  return items;
};

// Lê cat/sub/pac direto da URL (?cat=cat_3&sub=sub_3_1&pac=pac_3_1_2),
// que é como o bot do Telegram abre esse WebApp.
const readBotParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    cat: params.get("cat"),
    sub: params.get("sub"),
    pac: params.get("pac"),
  };
};

// TODO: trocar por checagem de VIP de verdade (ex: via
// window.Telegram.WebApp.initDataUnsafe.user.id batendo no seu backend).
// Por enquanto fixo em false só pra testar o blur.
const isUserVip = false;

function App() {
  const [search, setSearch] = useState("");
  const [botParams] = useState(() => readBotParams());
  const [items] = useState(() => generateMockItems());

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  // Filtra pelos parâmetros vindos do bot: se veio pac, mostra só aquele
  // pacote; senão se veio sub, mostra a subcategoria inteira; senão se veio
  // cat, mostra a categoria inteira; senão mostra tudo.
  const filteredByParams = useMemo(() => {
    if (botParams.pac) {
      return items.filter((item) => item.pacId === botParams.pac);
    }
    if (botParams.sub) {
      return items.filter((item) => item.subId === botParams.sub);
    }
    if (botParams.cat) {
      return items.filter((item) => item.catId === botParams.cat);
    }
    return items;
  }, [items, botParams]);

  const filtered = useMemo(() => {
    if (!search) return filteredByParams;
    return filteredByParams.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [filteredByParams, search]);

  return (
    <div className="bg-black min-h-screen text-white flex justify-center">
      {/* container mobile */}
      <div className="w-full max-w-sm">
        {/* 🔎 HEADER */}
        <div className="sticky top-0 bg-black p-3 border-b border-zinc-800 z-10">
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
          {filtered.map((item) => (
            <div key={item.id} className="bg-zinc-900 rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className={`w-full h-40 object-cover ${
                  item.premium && !isUserVip ? "blur-[3px]" : ""
                }`}
              />
              <p className="text-xs text-zinc-300 px-2 py-2 truncate">
                {item.title}
              </p>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-zinc-500 py-10 text-sm">
              Nenhum item encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;