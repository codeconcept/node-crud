const express = require("express");
const cors = require("cors");
const app = express();

// const missionMars = require("./data/mission-mars.json");
const crud = require("./services/crud.js");
const port = 3002;

let changes = [];

const isDevMode = true;
const fileName = isDevMode
  ? "./data/mission-mars-draft.json"
  : "./data/mission-mars.json";

const corsOptions = {
  origin: "http://localhost:3000",
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
//Used to parse JSON bodies
// (no more need for an external bodyParser)
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/data", async (req, res) => {
  const missionMars = await crud.readData(fileName);
  res.json(missionMars);
});

app.post("/data", async (req, res) => {
  console.log(`index.js | app.post() | at ${new Date().toISOString()}`);
  const body = req.body;
  console.log(`index.js | app.post() | body ${JSON.stringify(body, null, 2)}`);

  if (body.tasks && body.tasks.added) {
    console.log(
      `index.js | app.post() | body.tasks.added[0] ${JSON.stringify(
        body.tasks.added[0]
      )}`
    );
    const result = await crud.createData({
      fileName,
      data: body.tasks.added[0],
      dataType: "task",
    });
    console.log(`index.js | app.post() | result ${JSON.stringify(result)}`);
    return res.json({
      tasks: { rows: [{ $PhantomId: result["$PhantomId"], id: result["id"] }] },
    });
  }

  // An update of a task (like the name update) that does not causes a deletion of another object or property
  if (body.tasks && body.tasks.updated && !body.tasks.removed) {
    const result = await crud.updateData({
      fileName,
      data: body.tasks.updated[0],
      dataType: "task",
    });
    return res.json({ message: result.message });
  }
  if (body.tasks && body.tasks.removed) {
    // TODO delete task
    return res.json({ message: "TODO remove task" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
