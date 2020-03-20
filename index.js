const express = require('express');
const path = require('path');
const ip = require('ip');
const chalkConsole = require('chalk-console');

const app = express();
const port = 4000;
app.get('/', (req, res) => res.sendFile( path.resolve('./public/index.html')));
app.get('/bundle.js',(req, res)=>res.sendFile(path.resolve('./dist/bundle.js')));
console.clear();
chalkConsole.blue('\nServer Running ...\n');
app.listen(port, ()=>console.log('Server listening on http://localhost:'+port));
app.listen(port, ip.address() ,()=>console.log('Server listening on http://'+ip.address()+':'+port));