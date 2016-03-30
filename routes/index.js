var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', function (req, res) {
	res.render('search');
});

router.get('/browse', function (req, res) {
	res.render('browse');
});

router.get('/submit', function (req, res) {
	res.render('submit');
});

module.exports = router;
