const express = require("express");
const app = express()
const mongoose = require("mongoose");
const User = require("./models/users.model");



// const {users} = require("./users.json");




const mongoDBUrl = "mongodb://localhost/pagination"

mongoose.connect(mongoDBUrl, () => {
    console.log("connected to database");
})


const db = mongoose.connection;

db.once('open', async () => {
    if (await User.countDocuments().exec() > 0) return;

    Promise.all([
        User.create({ name: "User 1" }),
        User.create({ name: "User 2" }),
        User.create({ name: "User 3" }),
        User.create({ name: "User 4" }),
        User.create({ name: "User 5" }),
        User.create({ name: "User 6" }),
        User.create({ name: "User 7" }),
        User.create({ name: "User 8" }),
        User.create({ name: "User 9" }),
        User.create({ name: "User 10" }),
        User.create({ name: "User 11" }),
        User.create({ name: "User 12" }),
        User.create({ name: "User 13" }),
        User.create({ name: "User 14" }),
        User.create({ name: "User 15" }),
        User.create({ name: "User 16" }),
        User.create({ name: "User 17" }),
        User.create({ name: "User 18" }),
        User.create({ name: "User 19" }),
        User.create({ name: "User 20" }),
    ]).then(() => console.log("added users to database successfully"))
})

app.get("/users", paginatedResult(User), (req, res) => {
    res.json(res.paginatedResult);
})

// app.get("/posts", paginatedResult(posts), (req, res) => {
//     res.json(res.paginatedResult);
// })


function paginatedResult(model) {
    return async(req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // console.log("startIndex is == ", startIndex);
        // console.log("endIndex is == ", endIndex);

        const result = {};
        if (endIndex < await model.countDocuments().exec()) {
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
        console.log("result ", result)
        try {
            result.data = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResult = result
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
}


app.listen(3000, () => {
    console.log("listening on PORT 3000")
});
