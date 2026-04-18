import { useMemo, useState } from "react";

const Card = ({ children }: any) => (
  <div className="rounded-2xl bg-white shadow">{children}</div>
);

const CardContent = ({ children }: any) => (
  <div className="p-4">{children}</div>
);

const Button = ({ children, ...props }: any) => (
  <button {...props} className="bg-emerald-600 text-white px-4 py-2 rounded-xl">
    {children}
  </button>
);

const formatoMoneda = (cantidad: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(cantidad);

export default function App() {
  const [total, setTotal] = useState(800);

  const enviarWhatsApp = () => {
    const mensaje = `Hola, quiero cotizar una mudanza en CDMX. Mi presupuesto estimado es ${formatoMoneda(
      total
    )}`;
    const url = `https://wa.me/5215540647983?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 bg-white shadow">
        <div className="max-w-6xl mx-auto flex justify-between p-4">
          <h1 className="font-black text-xl">ZUVO Mudanzas</h1>
          <button
            onClick={enviarWhatsApp}
            className="bg-emerald-600 text-white px-4 py-2 rounded-full"
          >
            WhatsApp
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto p-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-4xl font-black">
            Mudanzas seguras y rápidas en CDMX
          </h2>
          <p className="mt-4 text-slate-600">
            Servicio profesional de mudanzas completas. Cuidamos tus muebles,
            llegamos a tiempo y te damos precio claro desde el inicio.
          </p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={enviarWhatsApp}
              className="bg-slate-900 text-white px-6 py-3 rounded-full"
            >
              Cotizar por WhatsApp
            </button>
          </div>
        </div>

        <Card>
          <CardContent>
            <h3 className="font-bold text-lg mb-2">Confianza real</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>✔️ +50 mudanzas realizadas</li>
              <li>✔️ Atención directa por WhatsApp</li>
              <li>✔️ Precios claros sin sorpresas</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* COTIZADOR SIMPLE */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-black">Cotiza rápido</h2>
          <p className="mt-3 text-slate-300">
            Ajusta tu presupuesto y envíanos tu solicitud en segundos
          </p>

          <div className="mt-8">
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-4 text-4xl font-black">
              {formatoMoneda(total)}
            </div>
          </div>

          <button
            onClick={enviarWhatsApp}
            className="mt-6 bg-emerald-600 px-6 py-3 rounded-full font-bold"
          >
            Enviar por WhatsApp
          </button>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="max-w-6xl mx-auto p-6 py-16">
        <h2 className="text-3xl font-black">Clientes satisfechos</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent>
              <p>"Muy puntuales y cuidadosos."</p>
              <div className="mt-2 font-bold">Laura</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p>"Precio claro desde el inicio."</p>
              <div className="mt-2 font-bold">Carlos</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p>"Recomendados, todo llegó perfecto."</p>
              <div className="mt-2 font-bold">Ana</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* BOTÓN FLOTANTE */}
      <a
        href="https://wa.me/5215540647983"
        target="_blank"
        className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-4 rounded-full shadow-xl"
      >
        WhatsApp
      </a>
    </div>
  );
}