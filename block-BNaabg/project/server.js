let http = require("http");
let path = require("path");
let fs = require("fs");
let server = http.createServer(handleRequest);
let url = require("url");
const { on } = require("events");

const userDir = path.join(__dirname, "users/");

function handleRequest(req,res){
    let parsedUrl = url.parse(req.url,true);
    let store = "";
    req.on("data", (chunk) => {
        store = store + chunk;
    });
    req.on("end", () => {
        if (req.method == "POST" && req.url == "/users"){
            let parsedData = JSON.parse(store);
            fs.open(userDir + parsedData.username + ".json", "wx", (err, fd) => {
                if (err){
                    return console.log(err)
                }
                fs.writeFile(fd, store, (err) => {
                if (err){
                    return console.log(err)
                }
                fs.close(fd, (err) => {
                    if (err){
                        return console.log(err)
                    }
                    res.setHeader("Content-Type", "text/plain");
                    res.end(`${parsedData.username} successfully created`);
                });
                });
            });
        }
        if (parsedUrl.pathname === "/users" && req.method === "GET") {
            let fileName = parsedUrl.query.username;
            fs.readFile(userDir + fileName + ".json", "utf8", (err, content) => {

                if (err) return console.log(err);
                res.setHeader("Content-Type", "application/json")
                res.end(content);
            });
        }
        if (req.method === "DELETE" && parsedUrl.pathname === "/users") {
            fs.unlink(userDir + parsedUrl.query.username + ".json", (err) => {
                if (err) return console.log(err);
                res.end(`${parsedData.username} is deleted successfully`);
            });
        }
        if (req.method === "PUT" && parsedUrl.pathname === "/users") {
            let parsedData = JSON.parse(store);
            fs.open(userDir + parsedUrl.query.username + ".json", "r+", (err, fd) => {
                if (err) return console.log(err);
                fs.ftruncate(fd, (err) => {
                    if (err) return console.log(err);
                fs.writeFile(fd, store, (err) => {
                    if (err) return console.log(err);
                fs.close(fd, (err) => {
                    if (err) return console.log(err);
                    res.setHeader("Content-Type", "text/plain");
                    res.end(`${parsedData.username} is updated successfully`);
                });
                });
            });
            });
        }
    })
}

server.listen(3000,()=> {
    console.log('server listening on port 3000');
})