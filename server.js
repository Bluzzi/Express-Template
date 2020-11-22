const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const convertSass = require("sass-folder-converter");

//TODO : https://www.npmjs.com/package/express-mailer

// Convert SASS to CSS :
convertSass(__dirname + "/public/sass/", __dirname + "/public/css/");

// Create express instance :
global.server = express();

// Setup the logger :
server.use(require("morgan")("dev"));

// Define public folder : 
server.use(express.static(__dirname + "/public"));

// Setup views folder :
server.set("views", __dirname + "/views");

// Setup view engine :
server.set("view engine", "ejs");

// Setup sessions and cookies :
server.use(require("cookie-parser")());

server.use(require("express-session")({
    secret: "09e60df3-e2d7-4c10-b103-380da8d5719b",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false // set in true if the website use https 
    }
}));

// Add body parser middleware for get body content (for post method) :
server.use(bodyParser.json()); // support json encoded bodies
server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Middleware for secure pages access :

/**
 * The privilege system uses the privileges.json configuration to set the accesses to the different pages as well as the page that allows the connection.
 * 
 * If no "login-route" key is specified, the visitor will be redirected to the root of the site.
 * 
 * To add permissions to a visitor, you have to go through the sessions, there is an array with the key "privileges" in it, this is where you have to add the permissions.
 * 
 * Example for add "ADMIN" permission : request.session.privileges.push("ADMIN");
 */

let privileges = JSON.parse(fs.readFileSync("privileges.json", {encoding: "utf-8"}));

server.use((request, response, next) => {
    if(!request.session.privileges) request.session.privileges = [];

    for(let [key, value] of Object.entries(privileges)){
        if(request.session.privileges.includes(key)) continue;

        for(let routeKey in value["routes-access"]){
            if(request.url.startsWith("/" + value["routes-access"][routeKey])){
                if(value["login-route"]){
                    response.redirect("/" + value["login-route"]);
                } else {
                    response.redirect("/");
                }

                return;
            }
        }
    }

    next();
});

// Routes and 404 error :
fs.readdirSync(__dirname + "/routes/").forEach(fileName => require("./routes/" + fileName)); //TODO: ajout du support des sous dossier.

server.get("*", (request, response) => {
    response.render("error");
    response.status(404);
});

// Listen port :
server.listen(3000);
