// import fs from "fs";
// import path from "path";

// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// export default app => {
//     fs
//         .readdirSync(__dirname)
//         .filter(file => ((file.indexOf(".")) !== 0 && (file !== "index.js")))
//         .forEach(file => 
//             import("file:///" + path.resolve(__dirname, file).toString())
//                 .then(module => module.default(app))
//                 .catch(error => console.log(error))
//         );
// }