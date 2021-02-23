// REQUIRED MODULES
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
// const process = require('process');

const flash = require('connect-flash');
const session = require('express-session');

http.listen(process.env.PORT || 3000);

// proc.execFile("neural_network/env/Scripts/activate", function() {
//     // do stuff
// });

// SETTING UP PAGES
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

// BODYPARSER
app.use(express.urlencoded({ extended: true }));

// EXPRESS SESSION
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// CONNECT FLASH
app.use(flash());

// GLOBAL VARIABLES
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

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
