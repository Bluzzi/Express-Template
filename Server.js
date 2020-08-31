const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// Create express instance :
let server = express();

// Setup the logger :
server.use(require("morgan")("dev"));

// Define public folder : 
server.use(express.static(__dirname + "/public"));

// Setup view engine :
server.set("twig", require("twig").renderFile);
server.set("view engine", "twig");

// Setup sessions and cookies :
server.use(require("cookie-parser")());

server.use(require("express-session")({
    secret: "09e60df3-e2d7-4c10-b103-380da8d5719b",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: true 
    }
}));

// Add body parser middleware for get body content (for post method) :
server.use(bodyParser.json()); // support json encoded bodies
server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Routes and 404 error :
fs.readdirSync("./routes/").forEach(fileName => {
    server.use(require("./routes/" + fileName))
});

server.get("*", function(request, response){
    response.status(404);
    response.render("error");
});

// Listen port :
server.listen(3000);