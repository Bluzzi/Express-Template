server.get("/", (request, response) => {
    response.render(
        "pages/index", 
        { 
            message: "Welcome in Express !" 
        }
    );
});