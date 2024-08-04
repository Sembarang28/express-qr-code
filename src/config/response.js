async function response(res, body) {
  try {
    if (body.code) {
      res.status(body.code);
      delete body.code;
      res.send(body);
      return;
    }
    res.status(body && body.status ? 200 : 400);
    res.send(body);
    return;
  } catch (error) {
    console.error("response module error: ", error);
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
}

module.exports = response;
