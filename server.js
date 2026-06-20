import http from 'http';
import fs from 'fs';
import path from 'path';
const port = process.env.PORT || 4173;
const file = path.join(process.cwd(), 'index.html');
http.createServer((req,res)=>{res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});res.end(fs.readFileSync(file));}).listen(port,()=>console.log(`Servidor local: http://localhost:${port}`));
