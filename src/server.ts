import express from "express";
import authRoutes from "./modules/auth/auth_routes.js";
import {env} from "./config/env.js";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(env.PORT, ()=> {
    console.log(`Server is running on port ${env.PORT}`);
});