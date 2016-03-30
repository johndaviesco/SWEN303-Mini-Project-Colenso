var express = require('express');
var router = express.Router();
var multer = require('multer');

var uploading = multer();
router.use(uploading.single('file'));

var cheerio = require('cheerio');
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

client.execute("OPEN Colenso");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', function (req, res) {
	res.render('search');
});

router.get("/browse",function(req,res) {

    var queries = req.query;

    var path = "";

    var depth = 0;

    if (queries.path != undefined) {
        path = queries.path;
        depth = path.split('/').length;
        path = path + '/';
    }

    client.execute("XQUERY for $p in collection('Colenso/" + path + "') return db:path($p)",
        function (error, result) {
            if (error) {
                console.error(error);
            } 
            else {
                var results = result.result.split('\n');
                var folders = [];
                var files = [];
                for (var i = 0; i < results.length; i += 1) {
                    if (results[i].split('/')[depth].indexOf('.xml') < 0) {
                        folders.push(path + results[i].split('/')[depth]);
                    } 
                    else {
                        files.push(results[i].split('/')[depth]);
                    }
                }
                var unique_folders = [];
                for (var i = 0; i < folders.length; i += 1) {
                    if (unique_folders.indexOf(folders[i]) < 0) {
                        unique_folders.push(folders[i]);
                    }
                }
                res.render('browse', {title: 'Some Letters?', path: path, folders: unique_folders, files: files});
            }
    })
});

router.get('/submit', function (req, res) {
	res.render('submit');
});

module.exports = router;
