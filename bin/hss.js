#!/usr/bin/env node
var os= require('os'),
	connect = require('connect'),
	serveStatic = require('serve-static'),
	serveIndex =require('serve-index'),
	cwd = process.cwd(),
	exec=require('child_process').exec,
	spawn =require('child_process').spawn;

var argv = require("minimist")(process.argv.slice(2), {
  alias: {
    'silent': 's',
    'port': 'p',
    'hostname': 'h'
  },
  string: 'port',
  boolean: 'silent',
  default: {
    'port': 8000
  }
});

var openURL=function(url){
	switch(process.platform){
		case "darwin":
			exec('open'+url);
			break;
		case "win32":
			exec('start'+url);
			break;
		default:
			spawn('xdg-open',[url]);
	}
}

var getIPAddress = function () {
  var ifaces = os.networkInterfaces();
  var ip = '';
  for (var dev in ifaces) {
    ifaces[dev].forEach(function (details) {
      if (ip === '' && details.family === 'IPv4' && !details.internal) {
        ip = details.address;
        return;
      }
    });
  }
  return ip || "127.0.0.1";
};

var app = connect();
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
app.use(serveStatic(cwd, {'index': ['index.html']}));
app.use(serveIndex(cwd, {'icons': true}));
// anywhere 8888
// anywhere -p 8989
// anywhere 8888 -s // silent
// anywhere -h localhost
var port = argv._[0] || argv.port;
var hostname = argv.hostname || getIPAddress();

app.listen(port, function () {
  // 忽略80端口
  port = (port != '80' ? ':' + port : '');
  var url = "http://" + hostname + port + '/';
  console.log("Running at " + url);
  if (!argv.silent) {
    openURL(url);
  }
});
