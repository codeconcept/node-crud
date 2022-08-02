const express = require("express");
const cors = require("cors");
const app = express();

const missionMars = require("./data/mission-mars.json");
const port = 3002;

let changes = [];
let fakeId = 123;

const corsOptions = {
  origin: "http://localhost:3000",
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
//Used to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/data", (req, res) => {
  res.json(missionMars);
});

app.post("/data", (req, res) => {
  const body = req.body;
  console.log("body", body);
  changes = [...changes, body];
  console.log(`changes`, changes);
  let phantomId = "";
  console.log(`body.tasks.added[0] ${JSON.stringify(body.tasks.added[0])}`);
  // TODO add cases for updated and deleted tasks
  if (body.tasks && body.tasks.added[0]["$PhantomId"]) {
    phantomId = body.tasks.added[0]["$PhantomId"];
  }
  res.json({ tasks: { rows: [{ $PhantomId: phantomId, id: ++fakeId }] } });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
