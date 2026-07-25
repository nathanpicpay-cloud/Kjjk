import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  'admin',
  'admin/produtos',
  'admin/pedidos',
  'admin/categorias',
  'admin/clientes',
  'admin/configuracoes',
  'admin/cupons',
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
