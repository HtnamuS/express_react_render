const express = require('express');
const path = require('path');
const ip = require('ip');
const chalkConsole = require('chalk-console');

const app = express();
let port = 4000;
app.get('/', (req, res) => res.sendFile( path.resolve('./public/index.html')));
app.get('/bundle.js',(req, res)=>res.sendFile(path.resolve('./dist/bundle.js')));
console.clear();
chalkConsole.blue('\nServer Running ...\n');
function onErrorHandler(ipAddr){
	port += 1;
	if(ipAddr === '127.0.0.1'){
		app.listen(port, ipAddr ,()=>console.log('Server listening on http://localhost:'+port)).on('error',onErrorHandler.bind(undefined, ip.address()));
	}
	else{
		app.listen(port, ipAddr ,()=>console.log('Server listening on http://'+ipAddr+':'+port)).on('error',onErrorHandler.bind(undefined, ip.address()));
	}
}
app.listen(port, '127.0.0.1',()=>console.log('Server listening on http://localhost:'+port)).on('error',onErrorHandler.bind(undefined, '127.0.0.1'));
app.listen(port, ip.address() ,()=>console.log('Server listening on http://'+ip.address()+':'+port)).on('error',onErrorHandler.bind(undefined, ip.address()));