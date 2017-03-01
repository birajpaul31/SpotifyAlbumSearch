var express = require('express'), app = express();
var http = require('http').Server(app);
var path = require("path");

app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/bootstrap', express.static(path.join(__dirname, 'public/bootstrap')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules/')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});