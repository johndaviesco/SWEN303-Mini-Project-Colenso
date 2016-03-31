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
                res.render('browse', {title: 'Browse Documents', path: path, folders: unique_folders, files: files});
            }
    })
});

router.get('/view', function(req, res) {
    var queries = req.query;
    client.execute("XQUERY doc ('Colenso/" + queries.path + "')",
        function(error, result) {
            if(error){
                console.error(error);
            } 
            else {
                res.render('view', {title: 'Document Viewer', search_result: result.result, path: queries.path});
            }
        }
    )
});

router.get('/edit', function(req,res) {
    var queries = req.query;
    client.execute("XQUERY doc ('Colenso/" + queries.path + "')",
        function(error, result) {
            if(error) {
                console.error(error);
            } else {
                res.render('edit', {title: 'Document Edit', search_result: result.result, path: queries.path});
            }

        }
    )
});

router.get('/submit', function (req, res) {
    res.render('submit');
});

router.post("/submit",function(req,res){
    var queries = req.query;
    client.replace(queries.path, req.body.text,
        function(error, result) {
            if(error) {
                console.error(error);
            } else {
                res.render('edit', {title: 'Document Edit', status: 'Changes Saved', search_result: req.body.text, path: queries.path});
            }
        }
    )
});

router.get('/download', function(req, res) {
    var queries = req.query;
    var fullpath  = queries.path.split('/');
    var filename = fullpath[fullpath.length - 1];
    client.execute("XQUERY doc ('Colenso/" + queries.path + "')",
        function(error, result) {
            if(error){
                console.error(error);
            }
            else {
                var doc = result.result;
                res.writeHead(200, {
                    'Content-Disposition': 'attachment; filename=' + filename
                });
                res.write(doc);
                res.end();
            }
        }
    )
});

module.exports = router;
