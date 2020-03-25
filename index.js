const webpackConfiguration = require('./webpack.config.js');
const webpack = require('webpack');
webpack(webpackConfiguration,()=>{});

const express = require('express');
const server = express();
let port = 3000;

const path = require('path');
server.get('/', (req, res) => res.sendFile(path.resolve('./public/index.html')));
server.get('/bundle.js',(req, res)=>res.sendFile(path.resolve('./dist/bundle.js')));


const chalkConsole = require('chalk-console');
chalkConsole.blue('\nServer Running ...\n');
const open = require('open');
function onErrorHandler(ipAddr,port){
	port += 1;
	if(ipAddr === '127.0.0.1'){
		server.listen(port, ipAddr ,()=>{
			console.log('Server listening on http://localhost:'+port);
			open('http://localhost:'+port, {app: 'google chrome'});
		}).on('error',onErrorHandler.bind(undefined, ipAddr,port));
	}
	else{
		server.listen(port, ipAddr ,()=>console.log('Server listening on http://'+ipAddr+':'+port)).on('error',onErrorHandler.bind(undefined, ip.address(),port));
	}
	console.log(port);
}
server.listen(port, '127.0.0.1',()=>console.log('Server listening on http://localhost:'+port)).on('error',onErrorHandler.bind(undefined, '127.0.0.1',port));
const ip = require('ip');
server.listen(port, ip.address() ,()=>console.log('Server listening on http://'+ip.address()+':'+port)).on('error',onErrorHandler.bind(undefined, ip.address(),port));
