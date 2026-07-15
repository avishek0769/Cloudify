import fs from "fs";
import path from "path";

export function walkDirectory(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.resolve(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDirectory(filePath));
        } else {
            results.push(filePath);
        }
    }
    return results;
}
