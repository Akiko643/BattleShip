import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { mapValidation, codeValidation } from "./validation.js";
import { generateData, getMatch, saveData } from "./file.js";

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/generate", (req, res) => {
    try {
        generateData();
        return res.send({ message: "Success!", status: 200 });
    } catch (error) {
        console.log("Error", error);
        return res.send({ message: error, status: 400 });
    }
});

app.get("/match/:path", async (req, res) => {
    try {
        const { path } = req.params;
        const data = await getMatch(path);
        return res.send({ message: "Success!", status: 200, data: data });
    } catch (error) {
        console.log("Error", error);
        return res.send({ message: error, status: 400 });
    }
});

app.post("/", (req, res) => {
    try {
        const { map, username, code } = req.body;
        let mapValidate = mapValidation(map),
            codeValidate = codeValidation(code);

        if (mapValidate || codeValidate) {
            throw mapValidate || codeValidate;
        }

        saveData({ map, username, code });
        return res.send({ message: "Success!", status: 200 });
    } catch (error) {
        console.log("Error", error);
        return res.send({ message: error, status: 400 });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port localhost:${port}`);
});
