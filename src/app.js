import express from "express";
import { Queue } from "bullmq";

const app = express();

app.get("/", (req, res) => {
	res.send("Hello World");
});

export default app;
const q = new Queue("test");
