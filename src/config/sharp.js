const sharp = require("sharp");

class Sharp {
  constructor() {
    this.filename = "";
  }

  generateFileName(file) {
    const originalFileName = file.originalname;
    const extension = originalFileName.split(".").pop();
    const currentDate = new Date().toISOString().replace(/[:.]/g, "-");
    this.filename = `${currentDate}.${extension}`;
  }

  async userImg(file) {
    this.generateFileName(file);
    await sharp(file.buffer)
      .jpeg({ quality: 60 })
      .toFile(`public/userImg/${this.filename}`);
  }

  async permissionImg(file) {
    this.generateFileName(file);
    await sharp(file.buffer)
      .jpeg({ quality: 60 })
      .toFile(`public/permissionImg/${this.filename}`);
  }
}

module.exports = new Sharp();
