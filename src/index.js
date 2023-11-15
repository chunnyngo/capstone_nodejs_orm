import express from "express";
import cors from "cors";
import rootRoute from "./routes/rootRoutes.js";

const app = express();
app.use(express.json());
app.use(express.static("."));
app.use(cors());
app.listen(8080);
app.use(rootRoute)