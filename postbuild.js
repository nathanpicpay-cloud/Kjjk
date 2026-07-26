import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  'painel-privado-bodin-joias',
  'painel-privado-bodin-joias/produtos',
  'painel-privado-bodin-joias/pedidos',
  'painel-privado-bodin-joias/categorias',
  'painel-privado-bodin-joias/clientes',
  'painel-privado-bodin-joias/configuracoes',
  'painel-privado-bodin-joias/cupons',
  'cart',
  'checkout',
  'catalog',
  'product_details'
];
const distDir = path.join(__dirname, 'dist');

if (fs.existsSync(distDir)) {
  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
  
  routes.forEach(route => {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml);
    console.log(`Successfully created fallback folder & index.html for /${route}`);
  });
} else {
  console.error('dist directory not found!');
}
