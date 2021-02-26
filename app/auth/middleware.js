const fs = require("fs");
const { getToken } = require("../utilts/get-token");
const config = require("../config");
const jwt = require("jsonwebtoken");

function decodeToken() {
  return function (req, res, next) {
    try {
      let token = getToken(req);
      if (!token) return next();
      req.user = jwt.verify(token, config.secretKey);

      let getAllUser = fs.readFileSync("../../db_json/users.json");
      let dataUser = JSON.parse(getAllUser);

      let user = dataUser.filter((objectData) =>
        objectData.token.filter((dataToken) => dataToken === token)
      );

      if (!user) {
        return res.json({
          error: 1,
          message: `Token expired`,
        });
      }
    } catch (error) {
      if (error && error.message === "JsonWebTokenError") {
        return res.json({
          error: 1,
          message: error.message,
        });
      }
      next(error);
    }
    return next();
  };
}

module.exports = { decodeToken };
