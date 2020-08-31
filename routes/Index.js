const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
    response.render(
        "pages/index", 
        { 
            message: "Welcome in Express !" 
        }
    );
});

module.exports = router;