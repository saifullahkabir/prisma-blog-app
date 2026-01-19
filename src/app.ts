import express from "express";

const app = express()

app.get("/", (req, res) => {
    res.send("Blog app server is running!")
})

export default app;