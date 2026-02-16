const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const yargs = require('yargs');
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init.js");
const { pullRepo } = require("./controllers/pull.js");
const { revertRepo } = require("./controllers/revert.js");
const { pushRepo } = require("./controllers/push.js");
const { commitRepo } = require("./controllers/commit.js");
const { addRepo } = require("./controllers/add.js");
const { Socket } = require("socket.io");

const mainRouter = require("./routes/main.router.js");

dotenv.config();

yargs(hideBin(process.argv))
    .command("start", "start a new server", {}, startServer)
    .command("init", "initialize new repository", {}, initRepo)
    .command("add <file>", "Add a file to the repository", (yargs) => {
        yargs.positional("file", {
            describe: "file to add to the staging area",
            type: "string",
        });
    },
        (argv) => {
            addRepo(argv.file);
        }
    )
    .command(
        "commit <message>",
        "commit the stage files",
        (yargs) => {
            yargs.positional("message", {
                describe: "commit message",
                type: "string",
            });
        },
        (argv) => {
            commitRepo(argv.message);
        }
    )
    .command("push", "push commits to s3", {}, pushRepo)
    .command("pull", "pu;; commits from s3", {}, pullRepo)
    .command(
        "revert <commitId>",
        "Revert to a specific commit",
        (yargs) => {
            yargs.positional("commitID", {
                describe: "comit ID to revert to",
                type: "string",
            });
        },
        (argv) => {
            revertRepo(argv.commitId);
        }
    )
    .demandCommand(1, "you need at least one command").help().argv;

function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;

    const mongoURL = process.env.MONGODB_URL;

    mongoose
        .connect(mongoURL)
        .then(() => console.log("mongoDb conntected"))
        .catch((err) => console.error("unable to connect : ", err));

    app.use(cors({ origin: "*" }));
    app.use(bodyParser.json());
    app.use(express.json());

    app.use("/", mainRouter);

    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        const userID = socket.handshake.query.userID || user;
        user = userID;
        console.log("====");
        console.log(user);
        console.log("=====");
        socket.join(userID);
    });

    const db = mongoose.connection;
    db.once("open", async () => {
        console.log("CRUD operations called");
    });
    httpServer.listen(port, () => {
        console.log(`server is running on port ${port}`);
    })
}