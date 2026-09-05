import fs from "fs";
import crypto from "crypto";

const hashImageFile = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(buffer).digest("hex");
};

export default hashImageFile;
