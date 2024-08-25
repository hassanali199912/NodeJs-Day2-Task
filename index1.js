const { uid } = require("uid");
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

app.get("/", (req, res) => {
  let todo = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

  res.status(200).json({
    wellcome: "Hello User , Wellcome to my todo app api",
    author: {
      name: "hassan ali",
      email: "hassanalihassan1203@gmail.com",
    },
    commands: {
      read: {
        method: "GET",
        url: "http://localhost:3000/",
      },
      create: {
        method: "POST",
        url: "http://localhost:3000/create",
        body: {
          title: "task title",
        },
      },
      edit: {
        method: "POST",
        url: "http://localhost:3000/edit",
        body: {
          id: "TASK_ID",
          new_title: "new task title",
        },
      },
      delete: {
        method: "DELETE",
        url: "http://localhost:3000/delete/TASK_ID",
      },
    },
    todo,
  });
});

app.post("/create", (req, res) => {
  let todo = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

  console.log(req.body);

  todo.push({
    id: uid(),
    title: req.body.title,
  });
  fs.writeFileSync("./todos.json", JSON.stringify(todo));
  res.status(200).json({
    massege: "Task Added Successfuly",
    todo: todo,
  });
});
app.post("/edit", (req, res) => {
  let todo = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

  console.log(req.body);

  let new_arr = todo.map((element) => {
    if (element.id === req.body.id) {
      element.title = req.body.new_title;
    }
    return element;
  });

  fs.writeFileSync("./todos.json", JSON.stringify(new_arr));
  res.status(200).json({
    massege: "Task Updated Successfuly",
    todo: new_arr,
  });
});

app.delete("/delete/:id", (req, res) => {
  let todo = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));
  let newArr = todo.filter((element) => element.id !== req.params.id);

  if (newArr.length !== todo.length) {
    fs.writeFileSync("./todos.json", JSON.stringify(newArr));
    res.status(200).json({
      massege: "Task Deleted Successfuly",
      todo: newArr,
    });
  } else {
    res.status(404).json({
      massege: "Data Not Found",
      todo: todo,
    });
  }
});

app.use("*", (req, res) => {
  let todo = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));
  res.status(404).json({
    message: "Cannot find the requested url",
    commands: {
      read: {
        method: "GET",
        url: "http://localhost:3000/",
      },
      create: {
        method: "POST",
        url: "http://localhost:3000/create",
        body: {
          title: "task title",
        },
      },
      edit: {
        method: "POST",
        url: "http://localhost:3000/edit",
        body: {
          id: "TASK_ID",
          new_title: "new task title",
        },
      },
      delete: {
        method: "DELETE",
        url: "http://localhost:3000/delete/TASK_ID",
      },
    },
    todo,
  });
});

app.listen(3000, () => {
  console.log("Server is running");
});
