const fs = require("fs").promises;
let fakeId = 123;

//get the user data from json file
const readData = async (fileName) => {
  const jsonData = await fs.readFile(fileName);
  return JSON.parse(jsonData);
};

const createData = async ({ fileName, data, dataType }) => {
  const currentData = await readData(fileName);
  console.log(
    `crud.js | createData | currentData ${JSON.stringify(currentData)}`
  );

  if (dataType === "task") {
    console.log(
      `crud.js | createData | if task at ${new Date().toISOString()}`
    );
    console.log(
      `crud.js | createData | currentData  Object.keys(currentData) ${Object.keys(
        currentData
      )}`
    );
    let tasks = currentData.tasks.rows;
    tasks = [...tasks, data];
    currentData.tasks.rows = tasks;
    // console.log(`crud.js | createData | currentData | tasks >>>>>>>> ${JSON.stringify(tasks, null, 2)}`);
    phantomId = data["$PhantomId"];
    await fs.writeFile(fileName, JSON.stringify(currentData));
    console.log(
      `crud.js | createData | currentData after task added ${JSON.stringify(
        currentData,
        null,
        2
      )}`
    );
    return { $PhantomId: phantomId, id: ++fakeId };
  }
  return null;
};

// body for a task name update is:
// {
//     "type": "sync",
//     "requestId": 16596186338081,
//     "tasks": {
//     "updated": [
//         {
//         "name": "Celebrate 1510",
//         "id": 5
//         }
//     ]
//     }
// }
const updateData = async ({ fileName, data, dataType }) => {

  if (dataType === "task") {
    const currentData = await readData(fileName);
    const rootTask = currentData.tasks.rows[0];
    if (rootTask.id === data.id) {
      rootTask.name = data.name;
      currentData.tasks.rows[0] = { ...rootTask };
      await fs.writeFile(fileName, JSON.stringify(currentData));
      return { message: `root task ${data.id} updated` };
    }
    // It's a child that we need to update
    let tasks = currentData.tasks.rows[0].children;
    let taskToUpdate = tasks.find((t) => t.id === data.id);
    taskToUpdate = { ...taskToUpdate, name: data.name };
    console.log(`taskToUpdate ${JSON.stringify(taskToUpdate, null, 2)}`);
    const updatedTasks = tasks.map((t) =>
      t.id === taskToUpdate.id ? taskToUpdate : t
    );
    currentData.tasks.rows[0].children = updatedTasks;

    await fs.writeFile(fileName, JSON.stringify(currentData));
    console.log(
      `crud.js | updateData | currentData after task updated ${JSON.stringify(
        currentData.tasks.rows,
        null,
        2
      )}`
    );
    return { message: `task ${data.id} updated` };
  }
};

// body for to task delete is:
// {
//     "type": "sync",
//     "requestId": 16596187058441,
//     "tasks": {
//       "updated": [
//         {
//           "duration": 13,
//           "endDate": "2030-01-14T00:00:00+01:00",
//           "effort": 312,
//           "percentDone": 73.07692307692308,
//           "id": 1
//         }
//       ],
//       "removed": [
//         {
//           "id": 5
//         }
//       ]
//     },
//     "dependencies": {
//       "removed": [
//         {
//           "id": "_generatedc6"
//         }
//       ]
//     }
//   }
const deleteData = ({ fileName, data, dataType }) => {
    // TODO
}

module.exports = { readData, createData, updateData, deleteData };
