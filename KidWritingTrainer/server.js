const express = require("express");
const path = require("path");
const fs = require("fs");
const port = process.env.PORT || process.env.port || 8888;

let app = express();
app.use(express.static("./public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/home.html"));
});

app.listen(port, () => {
    console.log(`Listening to por: ${port}`);
});