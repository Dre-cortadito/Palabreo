# Palabreo — auditoría completa de los pools de respuestas
**Fecha:** 2026-06-06 · **Revisado:** SOLUTIONS (700 palabras de 6), SOL_Q (782 de 5), 261 cuadrículas de Trenza (421 palabras distintas)

Criterio: las palabras RESPUESTA deben ser palabras españolas reales (DLE) y justas de deducir — sin nombres propios, lugares ni inglés. Los casos dudosos se verificaron contra https://dle.rae.es.

---

## 1. CLÁSICO — `SOLUTIONS` (1 eliminación)

| Palabra | Motivo |
|---|---|
| **carter** | Apellido inglés. (Nota: "cárter" SÍ está en el DLE — pieza del motor — así que es defendible; pero como respuesta diaria casi nadie la deduciría. Decisión tuya: yo la quitaría.) |

Verificadas y CORRECTAS (parecen sospechosas pero son DLE): junior (júnior), whisky, futbol, chaval, casino, sexual.

## 2. CUARTETO — `SOL_Q` (12 eliminaciones)

| Palabra | Motivo |
|---|---|
| **bruce** | Nombre inglés |
| **grant** | Apellido inglés |
| **green** | Inglés |
| **henry** | Nombre (la unidad física en español es "henrio") |
| **james** | Nombre inglés |
| **japon** | Topónimo (Japón) |
| **julia** | Nombre propio, sin entrada DLE |
| **lucas** | Nombre propio, sin entrada DLE estándar |
| **marte** | Solo DLE como término alquímico en desuso ("hierro"); los jugadores lo leerán como el planeta = nombre propio |
| **paris** | Topónimo (París) |
| **rusia** | Topónimo (Rusia) |
| **simon** | Nombre propio |

Verificadas y CORRECTAS (parecen nombres pero son palabras comunes DLE):
**cesar** (verbo cesar), **china** (piedra pequeña), **corea** (enfermedad; también de corear), **diana** (blanco de tiro / toque militar), **colin** (colín = pico de pan, Esp.), **mason** (masón), **vegas** (plural de vega, terreno fértil), **india/indio/judio** (gentilicios comunes), **julio/junio** (mes; julio además unidad de energía), **vodka, pizza, motel, super, video, kilos, robot, piano** (préstamos DLE).

## 3. TRENZA — `WAFFLES` (32 cuadrículas afectadas de 261)

Las mismas palabras flageadas aparecen tejidas en estas cuadrículas (índice en el array):

- rusia → 7, 10, 98, 147, 190, 225, 226, 229, 248
- green → 13, 33, 181, 208, 234
- paris → 14, 209
- henry → 21, 22, 23
- simon → 36 · japon → 60 · james → 62
- grant → 72, 74, 136
- bruce → 110 · lucas → 148 · julia → 158
- marte → 114, 115, 201, 246

⚠️ Las cuadrículas no se pueden editar palabra a palabra (los cruces deben seguir siendo válidos). Hay que **regenerar o reemplazar** esas 32 cuadrículas. Puedo hacerlo como tarea aparte si lo apruebas.

## 4. Nota editorial (palabras válidas, decisión tuya)

**zorra**, **perra**, **porno** están en los pools de respuestas. Son DLE-válidas y comunes, pero como respuesta del día pueden chocar a parte de la audiencia. Las dejo marcadas, sin recomendación de quitar.

## 5. Cómo aplicar

- Quitar las palabras de los arrays `SOLUTIONS` (línea ~755) y `SOL_Q` (línea ~803) de `Palabreo/index.html`.
- ⚠️ Quitar una palabra de un pool **rebaraja qué respuesta cae en qué fecha** (pasadas y futuras). Es inofensivo — nadie pierde rachas porque el estado se guarda por fecha — pero el "histórico" de respuestas cambia.
- Las cuadrículas de Trenza requieren regeneración (ver §3).

**Resumen: 13 eliminaciones de pools + 32 cuadrículas por regenerar. Nada urgente: la revisión semanal avisará si una de estas cae en los próximos 7 días.**

---

## APLICADO — 2026-06-06 (aprobado por Dre)

- ✅ **PORNO** eliminado de `SOL_Q` (decisión editorial de Dre). Sigue aceptado como intento, solo no sale como respuesta.
- ✅ **ZORRA y PERRA se quedan** — decisión de Dre: significan cosas reales (animal hembra).
- ✅ Los **12 nombres** eliminados de `SOL_Q` (la rebaraja tras quitar PORNO hizo caer HENRY al día siguiente — confirmó la urgencia).
- ✅ Las **32 cuadrículas de Trenza** con nombres se quitaron del array `WAFFLES` (quedan 229) en vez de regenerarlas — mismo patrón, cero riesgo de cruces inválidos.
- ⏸️ **CARTER** sigue en `SOLUTIONS` — pendiente de decisión ("cárter" es DLE; ver §1).
- ✔️ Semana siguiente verificada limpia en los 3 modos tras todos los cambios.
