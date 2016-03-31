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

router.get('/search', function(req, res) {
    if(req.query.searchString){
        var array = req.query.searchString.split(" ");
        var queryString = "";
            queryString += array[0];
            if(1 < array.length){
                if(array[1] === "OR"){
                    queryString += "' ftor '";
                    queryString += array[2];
                }
                else if(array[1] === "AND"){
                    queryString += "' ftand '";
                    queryString += array[2];
                }
                else if(array[1] === "NOT"){
                    queryString += "' ftand ftnot '";
                    queryString += array[2];
                }
                else if(array[0] === "NOT"){
                    queryString += "' ftand ftnot '";
                    queryString += array[2];
                }
                else{
                    queryString += " ";
                    queryString += array[1];
                }
            }
    }
    var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
        "for $n in (collection('Colenso')[. contains text '" + queryString + "' using wildcards])" +
        " return db:path($n)";
    client.execute(query,
        function (error, result) {
            if(error) {
                console.error(error);
            }
            else {
                var splitlist = result.result.split("\n");
                res.render('search', { title: 'Search', results: splitlist});
            }
        }
    );
});

router.get('/xquery', function(req, res) {
    var xquery = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
        "for $n in " + req.query.searchString +
        " return db:path($n)";

    client.execute(xquery,
        function (error, result) {
            if(error) {
                console.error(error);
            }
            else {
                var splitlist = result.result.split("\n");
                res.render('xquery', { title: 'Colenso Project', results: splitlist});
            }
        }
    );
});

router.post('/upload', function(req, res){
    var queries = req.query;

    if(req.file){
        var path = queries.path + req.file.originalname;

        var file = req.file.buffer.toString();
        client.execute('ADD TO ' + path + ' "' + file + '"', function(error, result){
            if(error){
                console.error(error);
            }
        });
    } else {
        console.log('no file?');
    }

    if (queries.path) {
        res.redirect('browse/?path=' + queries.path.substring(0, queries.path.length - 1));
    } else {
        res.redirect('browse');
    }
});

module.exports = router;
