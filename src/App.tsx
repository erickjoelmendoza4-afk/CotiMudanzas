import { useMemo, useState } from "react";

type Range = {
  min: number;
  max: number;
};

type Option = {
  label: string;
  min: number;
  max: number;
};

type Extra = {
  id: string;
  label: string;
  min: number;
  max: number;
};

const TIPOS_MUDANZA: Option[] = [
  { label: "Habitacion - pocas cosas", min: 500, max: 800 },
  { label: "Departamento chico", min: 800, max: 1200 },
  { label: "Casa promedio", min: 1200, max: 1800 },
  { label: "Casa completa", min: 2000, max: 3000 },
];

const DISTANCIAS: Option[] = [
  { label: "0 a 5 km", min: 0, max: 0 },
  { label: "5 a 15 km", min: 200, max: 200 },
  { label: "15 a 30 km", min: 500, max: 500 },
  { label: "30+ km", min: 700, max: 700 },
];

const PISOS_SIN_ELEVADOR: Option[] = [
  { label: "1er piso", min: 0, max: 0 },
  { label: "2do piso", min: 50, max: 50 },
  { label: "3er piso", min: 100, max: 100 },
  { label: "4to piso", min: 200, max: 200 },
  { label: "5to piso", min: 300, max: 300 },
];

const ELEVADORES: Option[] = [
  { label: "Elevador normal", min: 0, max: 0 },
  { label: "Elevador pequeno o lento", min: 100, max: 100 },
];

const MUEBLES_ESPECIALES: Extra[] = [
  { id: "refri1", label: "Refrigerador 1 puerta", min: 100, max: 100 },
  { id: "refri2", label: "Refrigerador 2 puertas", min: 250, max: 250 },
  { id: "lavadora", label: "Lavadora", min: 150, max: 150 },
  { id: "secadora", label: "Secadora", min: 150, max: 150 },
  { id: "lavasecadora", label: "Lavasecadora", min: 250, max: 250 },
  { id: "sofa", label: "Sofa grande", min: 100, max: 100 },
  { id: "cama", label: "Cama king size", min: 150, max: 150 },
  { id: "piano", label: "Piano", min: 500, max: 500 },
];

const SERVICIOS_ADICIONALES: Extra[] = [
  { id: "empaque", label: "Empaque basico", min: 300, max: 300 },
  { id: "armado", label: "Desarmado y armado", min: 200, max: 200 },
  { id: "proteccion", label: "Proteccion especial", min: 200, max: 200 },
];

const formatoMoneda = (cantidad: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(cantidad);

const formatoRango = (min: number, max: number) =>
  min === max
    ? formatoMoneda(min)
    : `${formatoMoneda(min)} - ${formatoMoneda(max)}`;

export default function App() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");

  const [tipoMudanza, setTipoMudanza] = useState(TIPOS_MUDANZA[0]);
  const [distancia, setDistancia] = useState(DISTANCIAS[0]);
  const [usaElevador, setUsaElevador] = useState(false);
  const [piso, setPiso] = useState(PISOS_SIN_ELEVADOR[0]);
  const [elevador, setElevador] = useState(ELEVADORES[0]);
  const [cargadoresExtra, setCargadoresExtra] = useState(0);

  const [mueblesSeleccionados, setMueblesSeleccionados] = useState<string[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>([]);

  const toggleSeleccion = (
    id: string,
    seleccionados: string[],
    setSeleccionados: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSeleccionados(
      seleccionados.includes(id)
        ? seleccionados.filter((item) => item !== id)
        : [...seleccionados, id]
    );
  };

  const totalMuebles = useMemo<Range>(() => {
    return MUEBLES_ESPECIALES.filter((item) =>
      mueblesSeleccionados.includes(item.id)
    ).reduce(
      (acc, item) => ({
        min: acc.min + item.min,
        max: acc.max + item.max,
      }),
      { min: 0, max: 0 }
    );
  }, [mueblesSeleccionados]);

  const totalServicios = useMemo<Range>(() => {
    return SERVICIOS_ADICIONALES.filter((item) =>
      serviciosSeleccionados.includes(item.id)
    ).reduce(
      (acc, item) => ({
        min: acc.min + item.min,
        max: acc.max + item.max,
      }),
      { min: 0, max: 0 }
    );
  }, [serviciosSeleccionados]);

  const totalCargadores: Range = {
    min: cargadoresExtra * 150,
    max: cargadoresExtra * 150,
  };

  const costoAcceso = usaElevador ? elevador : piso;

  const total = {
    min:
      tipoMudanza.min +
      distancia.min +
      costoAcceso.min +
      totalMuebles.min +
      totalServicios.min +
      totalCargadores.min,
    max:
      tipoMudanza.max +
      distancia.max +
      costoAcceso.max +
      totalMuebles.max +
      totalServicios.max +
      totalCargadores.max,
  };

  const enviarWhatsApp = () => {
    const numero = "525512345678";

    const mueblesTexto =
      mueblesSeleccionados.length > 0
        ? MUEBLES_ESPECIALES.filter((item) =>
            mueblesSeleccionados.includes(item.id)
          )
            .map((item) => `- ${item.label}: ${formatoRango(item.min, item.max)}`)
            .join("\n")
        : "- Ninguno";

    const serviciosTexto =
      serviciosSeleccionados.length > 0
        ? SERVICIOS_ADICIONALES.filter((item) =>
            serviciosSeleccionados.includes(item.id)
          )
            .map((item) => `- ${item.label}: ${formatoRango(item.min, item.max)}`)
            .join("\n")
        : "- Ninguno";

    const mensaje = `Hola, quiero solicitar una cotizacion de mudanza.

Nombre: ${nombre || "No especificado"}
Telefono: ${telefono || "No especificado"}
Origen: ${origen || "No especificado"}
Destino: ${destino || "No especificado"}

Tipo de mudanza: ${tipoMudanza.label} (${formatoRango(tipoMudanza.min, tipoMudanza.max)})
Distancia: ${distancia.label} (${formatoRango(distancia.min, distancia.max)})
Acceso: ${usaElevador ? elevador.label : piso.label} (${formatoRango(costoAcceso.min, costoAcceso.max)})

Muebles especiales:
${mueblesTexto}

Cargadores extra: ${cargadoresExtra} (${formatoMoneda(totalCargadores.min)})

Servicios adicionales:
${serviciosTexto}

Total estimado: ${formatoRango(total.min, total.max)}`;

    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <h1 className="text-4xl font-black">Cotizador de Mudanza</h1>
          <p className="mt-3 text-slate-600">
            Calcula un precio estimado y envialo por WhatsApp.
          </p>

          <div className="mt-8 grid gap-5">
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              className="rounded-xl border border-stone-300 px-4 py-3"
            />

            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Telefono"
              className="rounded-xl border border-stone-300 px-4 py-3"
            />

            <input
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              placeholder="Direccion de origen"
              className="rounded-xl border border-stone-300 px-4 py-3"
            />

            <input
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Direccion de destino"
              className="rounded-xl border border-stone-300 px-4 py-3"
            />

            <select
              className="rounded-xl border border-stone-300 px-4 py-3"
              onChange={(e) => setTipoMudanza(TIPOS_MUDANZA[Number(e.target.value)])}
            >
              {TIPOS_MUDANZA.map((item, index) => (
                <option key={item.label} value={index}>
                  {item.label} - {formatoRango(item.min, item.max)}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl border border-stone-300 px-4 py-3"
              onChange={(e) => setDistancia(DISTANCIAS[Number(e.target.value)])}
            >
              {DISTANCIAS.map((item, index) => (
                <option key={item.label} value={index}>
                  {item.label} - {formatoRango(item.min, item.max)}
                </option>
              ))}
            </select>

            <div className="rounded-2xl border border-stone-300 p-4">
              <div className="font-semibold">Acceso al inmueble</div>
              <div className="mt-3 flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!usaElevador}
                    onChange={() => setUsaElevador(false)}
                  />
                  Sin elevador
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={usaElevador}
                    onChange={() => setUsaElevador(true)}
                  />
                  Con elevador
                </label>
              </div>

              {!usaElevador ? (
                <select
                  className="mt-4 w-full rounded-xl border border-stone-300 px-4 py-3"
                  onChange={(e) => setPiso(PISOS_SIN_ELEVADOR[Number(e.target.value)])}
                >
                  {PISOS_SIN_ELEVADOR.map((item, index) => (
                    <option key={item.label} value={index}>
                      {item.label} - {formatoRango(item.min, item.max)}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  className="mt-4 w-full rounded-xl border border-stone-300 px-4 py-3"
                  onChange={(e) => setElevador(ELEVADORES[Number(e.target.value)])}
                >
                  {ELEVADORES.map((item, index) => (
                    <option key={item.label} value={index}>
                      {item.label} - {formatoRango(item.min, item.max)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="rounded-2xl border border-stone-300 p-4">
              <div className="font-semibold">Muebles especiales</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {MUEBLES_ESPECIALES.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3"
                  >
                    <span className="text-sm">
                      {item.label} ({formatoRango(item.min, item.max)})
                    </span>
                    <input
                      type="checkbox"
                      checked={mueblesSeleccionados.includes(item.id)}
                      onChange={() =>
                        toggleSeleccion(
                          item.id,
                          mueblesSeleccionados,
                          setMueblesSeleccionados
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-300 p-4">
              <div className="font-semibold">Cargadores extra</div>
              <input
                type="number"
                min={0}
                value={cargadoresExtra}
                onChange={(e) => setCargadoresExtra(Number(e.target.value) || 0)}
                className="mt-4 w-full rounded-xl border border-stone-300 px-4 py-3"
              />
              <p className="mt-2 text-sm text-slate-500">
                2 cargadores ya van incluidos. Cada extra cuesta {formatoMoneda(150)}.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-300 p-4">
              <div className="font-semibold">Servicios adicionales</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SERVICIOS_ADICIONALES.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3"
                  >
                    <span className="text-sm">
                      {item.label} ({formatoRango(item.min, item.max)})
                    </span>
                    <input
                      type="checkbox"
                      checked={serviciosSeleccionados.includes(item.id)}
                      onChange={() =>
                        toggleSeleccion(
                          item.id,
                          serviciosSeleccionados,
                          setServiciosSeleccionados
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={enviarWhatsApp}
              className="rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white hover:bg-emerald-700"
            >
              Enviar cotizacion por WhatsApp
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
          <h2 className="text-2xl font-black">Resumen</h2>

          <div className="mt-6 grid gap-4 text-sm">
            <div className="flex justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-300">Mudanza</span>
              <span>{formatoRango(tipoMudanza.min, tipoMudanza.max)}</span>
            </div>

            <div className="flex justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-300">Distancia</span>
              <span>{formatoRango(distancia.min, distancia.max)}</span>
            </div>

            <div className="flex justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-300">Acceso</span>
              <span>{formatoRango(costoAcceso.min, costoAcceso.max)}</span>
            </div>

            <div className="flex justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-300">Muebles especiales</span>
              <span>{formatoRango(totalMuebles.min, totalMuebles.max)}</span>
            </div>

            <div className="flex justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-300">Cargadores extra</span>
              <span>{formatoRango(totalCargadores.min, totalCargadores.max)}</span>
            </div>

            <div className="flex justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-300">Servicios adicionales</span>
              <span>{formatoRango(totalServicios.min, totalServicios.max)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-white/10 p-5">
            <div className="text-sm text-slate-300">Total estimado</div>
            <div className="mt-2 text-3xl font-black">
              {formatoRango(total.min, total.max)}
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            El precio final puede ajustarse segun volumen real, accesos, maniobras
            especiales y zona exacta.
          </p>
        </div>
      </div>
    </div>
  );
}
