const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const connect = () => {
    return mongoose.connect("mongodb+srv://dbadmin:passw0rd@cluster0.blzg8.mongodb.net/test");
}

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });



const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    todoId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'todo'
        }
    ]
}, { timestamps: true });


const Todo = mongoose.model("Todo", todoSchema);
const User = mongoose.model("User", userSchema);

app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find().lean().exec();
        return res.status(200).send({ todos });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});


app.post("/todos", async (req, res) => {
    try {
        const todo = await Todo.create(req.body);
        return res.status(201).send({ todo });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});


app.get("/todos/:todoId", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.todoId).lean().exec();
        return res.status(200).send({ todo });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

app.patch("/todos/:todoId", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.todoId, req.body, { new: true }).lean().exec();
        return res.status(200).send({ todo });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

app.delete("/todos/:todoId", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.todoId).lean().exec();
        return res.status(200).send({ todo });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

app.listen(5000, async () => {
    try {
        await connect();
        console.log("Connected to database");
    } catch (err) {
        console.log("Error connecting to database");
    }

    console.log("App running on port 5000");
});