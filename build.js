import fs from 'fs';
import path from 'path';
const root = process.cwd();
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const file of ['index.html', '_redirects']) {
  if (fs.existsSync(path.join(root, file))) fs.copyFileSync(path.join(root, file), path.join(dist, file));
}
console.log('Build concluído: arquivos copiados para /dist');
