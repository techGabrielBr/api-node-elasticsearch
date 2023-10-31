const express = require("express");
const elasticClient = require("./config/elastic-client");

const app = express();

app.use(express.json());


//routes
app.get("/", (req, res) => {
    res.redirect("http://localhost:3030/");
});

app.post("/posts", async (req, res) => {
    const result = await elasticClient.index({
        index: "posts",
        document: {
            title: req.body.title,
            author: req.body.author,
            content: req.body.content,
        },
    });

    res.send(result);
});

app.delete("/posts", async (req, res) => {
    const result = await elasticClient.delete({
        index: "posts",
        id: req.query.id,
    });

    res.json(result);
});

app.get("/search", async (req, res) => {
    const result = await elasticClient.search({
        index: "posts",
        query: { fuzzy: { title: req.query.query } },
    });

    res.json(result);
});

app.get("/posts", async (req, res) => {
    const result = await elasticClient.search({
        index: "posts",
        query: { match_all: {} },
    });

    res.send(result);
});

module.exports = app;

