import fs from "fs";
import lineReader from "line-reader";
import util from "util";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);
const eachLine = util.promisify(lineReader.eachLine);

export const saveData = async ({ username, map, code }) => {
    const userData = {
        username,
        map,
        code,
    };

    const path = "./data/data.json";
    const data = await readFile(path);
    const obj = JSON.parse(data);
    const ind = obj.findIndex((el) => el.username === username);
    if (ind >= 0) obj[ind] = userData;
    else obj.push(userData);
    const json = JSON.stringify(obj);
    await writeFile(path, json);
};

export const generateData = async () => {
    const folder = "../data/";
    const dataPath = folder + "data.json";
    const mapPath = folder + "map.txt";
    const userPath = folder + "user.txt";
    const codePath = folder + "code.txt";

    const data = await readFile(dataPath);
    const obj = JSON.parse(data);
    await writeFile(userPath, "");
    await writeFile(mapPath, "");
    await writeFile(codePath, "");

    await appendFile(userPath, JSON.stringify(obj.length) + "\n");
    await appendFile(mapPath, JSON.stringify(obj.length) + "\n");
    await appendFile(codePath, JSON.stringify(obj.length) + "\n");

    for (let i = 0; i < obj.length; i++) {
        const { username, map, code } = obj[i];
        await appendFile(userPath, username + "\n");
        for (let j = 0; j < map.length; j++) {
            for (let k = 0; k < map[j].length; k++) {
                await appendFile(mapPath, JSON.stringify(map[j][k]) + " ");
            }
            await appendFile(mapPath, "\n");
        }
        await appendFile(mapPath, "\n");
        const fixedCode =
            "    {\n" +
            code +
            "\n\n" +
            "        shooters.pb(shooter);\n    }\n";
        await appendFile(codePath, fixedCode);
    }
};

export const getMatch = async (path) => {
    const folder = "../data/games/";
    const dataPath = folder + path + ".txt";
    const lines = [];
    const data = await readFile("../data/data.json");
    const obj = JSON.parse(data);

    await eachLine(dataPath, (line, last) => {
        lines.push(line);
    });
    const totalTurns = parseInt(lines[0]);
    const turns = [];
    const firstPlayer = path.split("_")[0];
    const secondPlayer = path.split("_")[2];
    const firstPlayerMap = obj.find((el) => el.username === firstPlayer).map;
    const secondPlayerMap = obj.find((el) => el.username === secondPlayer).map;

    for (let i = 0; i < totalTurns; i++) {
        const arr = lines[i + 1].split(" ");
        const turnData = {};
        turnData.player = arr[0];
        turnData.x = parseInt(arr[1]);
        turnData.y = parseInt(arr[2]);
        turnData.result = parseInt(arr[3]);
        turns.push(turnData);
    }

    const arr = lines[totalTurns + 1].split(" ");
    const winner = arr[0];
    const score = parseFloat(arr[arr.length - 2]);

    return {
        totalTurns,
        firstPlayer,
        secondPlayer,
        turns,
        winner,
        score,
        firstPlayerMap,
        secondPlayerMap,
    };
};

export const getLeaderboard = async () => {
    const dataPath = "../data/leaderboard.txt";
    const lines = [];
    await eachLine(dataPath, (line, last) => {
        lines.push(line);
    });

    return lines.map((line) => {
        const arr = line.split(": ");
        const username = arr[0];
        const score = parseFloat(arr[1]);
        return {
            username,
            score,
        };
    });
};
