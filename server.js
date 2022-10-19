const express = require("express");
const app = express()
const mongoose = require("mongoose");


// const {users} = require("./users.json");







app.get("/users", paginatedResult(users), (req, res) => {
    res.json(res.paginatedResult);
})

app.get("/posts", paginatedResult(posts), (req, res) => {
    res.json(res.paginatedResult);
})


function paginatedResult(model) {
    return (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
    
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        // console.log("startIndex is == ", startIndex);
        // console.log("endIndex is == ", endIndex);
    
        const result = {};
        if (endIndex < model.length) {
            result.next = {
                page: page + 1,
                limit: limit
            }
        }
    
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit
            }
        }

        result.data = model.slice(startIndex, endIndex)
    
        res.paginatedResult = result
        next();
    }
}


app.listen(3000, () => {
    console.log("listening on PORT 3000")
});
