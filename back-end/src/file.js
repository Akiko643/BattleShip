import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

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
    const folder = "./data/";
    const dataPath = folder + "data.json";
    const mapPath = folder + "map.txt";
    const userPath = folder + "user.txt";
    const codePath = folder + "code.txt";

    const data = await readFile(dataPath);
    const obj = JSON.parse(data);

    await appendFile(userPath, JSON.stringify(obj.length) + "\n");
    await appendFile(mapPath, JSON.stringify(obj.length) + "\n");
    await appendFile(codePath, JSON.stringify(obj.length) + "\n");

    for (let i = 0; i < obj.length; i++) {
        const { username, map, code } = obj[i];
        await appendFile(userPath, username + " ");
        for (let j = 0; j < map.length; j++) {
            for (let k = 0; k < map[j].length; k++) {
                await appendFile(mapPath, JSON.stringify(map[j][k]) + " ");
            }
        }
        const fixedCode =
            "    {\n" +
            code +
            "\n\n" +
            "        shooters.pb(shooter);\n    }\n";
        await appendFile(codePath, fixedCode);
    }
};
