const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
// middleware
var cors = require("cors");
app.use(cors());
app.use(express.json()); // to get data from client

app.get("/", (req, res) => {
  res.send("Coffee Server");
});

app.listen(port, () => {
  console.log(`Coffee server is running on : ${port}`);
});
