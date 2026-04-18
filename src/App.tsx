import { useMemo, useState } from "react";

const Card = ({ children }: any) => (
  <div className="rounded-2xl bg-white shadow-md border">
    {children}
  </div>
);

const CardContent = ({ children }: any) => (
  <div className="p-5">{children}</div>
);

const formatoMoneda = (cantidad: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(cantidad);

export default function App() {
  // estados
  const [elevador, setElevador] = useState<"sin" | "con">("sin");
  const [piso, setPiso] = useState(0);
  const [extras, setExtras] = useState<string[]>([]);

  const toggleExtra = (item: string) => {
    setExtras((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  // cálculo
  const total = useMemo(() => {
    let base = 800;
    let extraCost = 0;

    if (extras.includes("refri")) extraCost += 100;
    if (extras.includes("lavadora")) extraCost += 150;
    if (extras.includes("sofa")) extraCost += 100;

    return base + piso + extraCost;
  }, [piso, extras]);

  const enviarWhatsApp = () => {
    const mensaje = `Hola, quiero cotizar una mudanza. Total estimado: ${formatoMoneda(
      total
    )}`;
    window.open(
      `https://wa.me/5215540647983?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-slate-900 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-2xl font-black mb-6">Zuvo</h1>

        <div className="grid md:grid-cols-3 gap-6">

          {/* IZQUIERDA */}
          <div className="md:col-span-2 space-y-6">

            {/* ACCESO */}
            <Card>
              <CardContent>
                <h3 className="font-bold mb-4">Acceso al inmueble</h3>

                <div className="flex gap-4">
                  <button
                    onClick={() => setElevador("sin")}
                    className={`px-4 py-2 rounded-xl border ${
                      elevador === "sin"
                        ? "bg-emerald-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    Sin elevador
                  </button>

                  <button
                    onClick={() => setElevador("con")}
                    className={`px-4 py-2 rounded-xl border ${
                      elevador === "con"
                        ? "bg-emerald-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    Con elevador
                  </button>
                </div>

                <select
                  onChange={(e) => setPiso(Number(e.target.value))}
                  className="mt-4 w-full border p-2 rounded-xl"
                >
                  <option value={0}>1er piso (+$0)</option>
                  <option value={100}>2do piso (+$100)</option>
                  <option value={200}>3er piso (+$200)</option>
                </select>
              </CardContent>
            </Card>

            {/* EXTRAS */}
            <Card>
              <CardContent>
                <h3 className="font-bold mb-4">Muebles especiales</h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "refri", label: "🧊 Refri", price: 100 },
                    { id: "lavadora", label: "🧺 Lavadora", price: 150 },
                    { id: "sofa", label: "🛋️ Sofá", price: 100 },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleExtra(item.id)}
                      className={`p-3 rounded-xl border ${
                        extras.includes(item.id)
                          ? "bg-emerald-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      {item.label} +${item.price}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <button
              onClick={enviarWhatsApp}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold"
            >
              Enviar cotización por WhatsApp
            </button>
          </div>

          {/* DERECHA */}
          <div>
            <div className="sticky top-6">
              <Card>
                <CardContent>
                  <h3 className="font-bold mb-4">Resumen</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base</span>
                      <span>$800</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Piso</span>
                      <span>${piso}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Extras</span>
                      <span>
                        $
                        {extras.reduce((acc, item) => {
                          if (item === "refri") return acc + 100;
                          if (item === "lavadora") return acc + 150;
                          if (item === "sofa") return acc + 100;
                          return acc;
                        }, 0)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-3xl font-black">
                    {formatoMoneda(total)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}