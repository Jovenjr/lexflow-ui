
# LexFlow UI (React + Vite + Tailwind + Electron)

Frontend modernizado compatible para Web (Vite) y Escritorio (Electron).

## Scripts

| comando | descripción |
|---------|-------------|
| `npm run dev` | levanta vite en http://localhost:5173 |
| `npm run build` | compila producción en /dist |
| `npm run electron-dev` | inicia vite **y** electron para modo escritorio |

## Características incluidas

* **Autenticación JWT** con renovación automática (`/auth/token/refresh`)
* **React Query** + **Axios** para manejar las peticiones a la API (`/api`)
* **TailwindCSS** para el diseño (colores basados en el mockup provisto)
* **Sidebar** lateral plegable y **Topbar** con selector de moneda, perfil y toggle dark/light
* **Dashboard** con estadísticas en vivo (`/dashboard/stats`)
* CRUD básico de **Expedientes** (listado, creación, detalle)
* Utilidad `downloadPdf()` para descargar PDFs de facturas (`/facturas/{id}/pdf`)
* Placeholder para **convertir Cotización → Factura** mediante `/cotizaciones/{id}/convertir-a-factura`
* Listas reactivas con componente `DataTable`
* Listo para empaquetar como app de escritorio mediante `electron-builder`

## Variables de entorno

Crea `.env`:

```bash
VITE_API_URL=https://tu-api.com/api
```

## Pendiente / siguiente iteración

* Formularios completos para Facturas, Cotizaciones, Citas, etc.
* Calendario en `Agenda`
* Subida / gestión de documentos
* Sección de Administración (usuarios, equipos)
* Ajustar **Electron auto‑update** y empaquetado instalador

¡El proyecto compila y corre inmediatamente sin mezclar archivos viejos!
