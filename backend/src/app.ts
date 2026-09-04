import helmet from "helmet";
import cors from "cors";
import express from "express"
import { prisma } from "./config/prisma.js";



const app = express();

app.use(helmet());
app.use(cors());
app.use(express());


app.get("/api/health",async (_req, res) => {
   try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
        success: true,
        api:"online",
        database:"connected",
    });
   } catch (error) {
    console.error(error);

    res.status(500).json({
        success: false,
        api: "online",
        database: "disconnected",
    });
   }
})





export default app;