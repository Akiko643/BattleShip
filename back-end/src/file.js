import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

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
