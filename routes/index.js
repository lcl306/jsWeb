var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chatroom', function(req, res, next) {
  res.render('chatroom/chatClient', { title: 'Express' });
});

router.get('/charts/column', function(req, res, next) {
	  res.render('charts/column', { title: 'Express' });
});

module.exports = router;
