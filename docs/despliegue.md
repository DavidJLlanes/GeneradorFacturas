# Despliegue

La web es estática: se construye con Vite y se publica en `/var/www/djl.com.es/factura`
(https://djl.com.es/factura/). El despliegue es manual, sin GitHub Actions.

## Requisitos en el servidor

- Node.js 22.13 o superior (`node -v`) y npm.
- Git.

## Primera vez

El código fuente se clona **fuera** de la carpeta web, para no exponerlo:

```bash
cd /opt
sudo git clone https://github.com/DavidJLlanes/GeneradorFacturas.git
cd GeneradorFacturas
sudo ./scripts/deploy.sh
```

## Actualizar

```bash
cd /opt/GeneradorFacturas
sudo ./scripts/deploy.sh
```

El script hace `git pull`, `npm ci`, `npm run build` y copia `dist/` a
`/var/www/djl.com.es/factura`. Se puede indicar otro destino como primer argumento:
`./scripts/deploy.sh /ruta/destino`.

## Nginx

Como `/var/www/djl.com.es/factura` está dentro de la raíz del sitio, Nginx la sirve sin
configuración adicional, salvo que exista un `location` que capture esa ruta. Si algo falla,
revisar `/etc/nginx/sites-available/djl.com.es`. Comprobación:

```bash
curl -I https://djl.com.es/factura/
```

Debe responder `200`. Los recursos se piden bajo `/factura/assets/`.

## Volver a una versión anterior

`deploy.sh` usa `git pull --ff-only`, pensado para `main`. Para volver a un commit anterior hay
que construirlo a mano y después regresar a `main`:

```bash
cd /opt/GeneradorFacturas
sudo git checkout <commit>
sudo npm ci && sudo npm run build
sudo find /var/www/djl.com.es/factura -mindepth 1 -maxdepth 1 -exec rm -rf {} +
sudo cp -a dist/. /var/www/djl.com.es/factura/
sudo git checkout main
```
