/*  TODO LIST
      FIND THE ASSETS
*/

// REQUIRED MODULES
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

http.listen(process.env.PORT || 3000);

// SETTING UP PAGES
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('./server/assets'));

// BODYPARSER
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use('/', require('./routes/index.js'));

// TESTING OUT SOCKETS
io.on('connection', function(socket) {
  console.log('client connected to server');

  socket.on('send_canvas', function(canvas) {
    var spawn = require("child_process").spawn;
    var child_process = spawn('python', ["./server/neural_network/network.py", canvas]);

    child_process.stdout.on('data', function(data) {
      console.log(data.toString());
      socket.emit('number_returned', { guess: data.toString() });
    });
  });

  socket.on('disconnect', function() {
    console.log('client disconnected');
  });
});

// // ERRORS
// 404 PAGE
app.use(function (req, res, next) {
  res.status(404).render("error/404");
});

// 500 PAGE
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).render(__dirname + '/views/error/500');
});
