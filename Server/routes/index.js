const express = require('express');
const router = express.Router();
// router.use(express.static('./server/assets'));

router.get('/', function(req, res) {
  res.redirect('/home');
})

router.get('/home', function(req, res) {
  res.render('base/index');
});

module.exports = router;
