import helmet from "helmet";
import cors from "cors";
import express from "express"



const app = express();

app.use(helmet());
app.use(cors());
app.use(express());


app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "API Associaion franco-Persane opérationnelle"
    })
})





export default app;