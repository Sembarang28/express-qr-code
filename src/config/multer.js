const multer = require("multer");

class Multer {
  constructor() {
    this.storagePermissionImg = multer.memoryStorage();
    this.storageUserImg = multer.memoryStorage();

    this.uploadUserImg = multer({ storage: this.storageUserImg });
    this.uploadPermissionImg = multer({ storage: this.storagePermissionImg });
  }

  userImg(image) {
    return this.uploadUserImg.single(image);
  }

  permissionImg(image) {
    return this.uploadPermissionImg.single(image);
  }
}

module.exports = new Multer();
