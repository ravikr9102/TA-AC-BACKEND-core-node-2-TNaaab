var http = require('http');
var qs = require('querystring');


var server = http.createServer(handleRequest);

function handleRequest(req,res){
    var store = '';
    console.log(req.headers['Content-type']);
    req.on('data', (chunk) => {
        store =+ chunk;
    })

    req.on('end', () => {
        if(req.headers['Content-type'] === 'application/x-www-form-urlencoded'){
            var formData = qs.parse(store);
            res.setHeader('Content-type','text/html');
            res.end(JSON.stringify(formData));
        }
        if(req.headers['content-type'] === 'application/json'){
            var jsonData = JSON.parse(store);
            res.setHeader('Content-type','text/html');
            res.end(`<h2> ${jsonData.name}</h2><p>${jsonData.email}</p>`)
        }
    })
}

server.listen(9000,() => {
    console.log('server listening on port 9000');
})

