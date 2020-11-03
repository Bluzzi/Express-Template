server.get("/", (request, response) => {
    response.render("index", { 
        message: "Welcome in Express !" 
    });
});