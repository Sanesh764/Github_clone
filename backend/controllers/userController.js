///isme  mongodb use kiye hai samjhne ke liye kaise work karta hai but tm ek project me kooi ek hi use karna ya to manogoose ya to mongodb
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ReturnDocument } = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URL;

let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
        await client.connect();
    }
}

async function signup(req, res) {
    const { username, password, email } = req.body;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "user already exists!" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: []
        }
        const result = await usersCollection.insertOne(newUser);
        const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET_KEY, { expiresIn: 3600 }); // 1 hour in seconds
        res.json({ token, userId: result.insertedId.toString() });
    } catch (err) {
        console.error("error during signup: ", err.message);
        res.status(500).send("server error");
    }
};

async function login(req, res) {
    const { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "invalid credential!" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "invalid credential!" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, userId: user._id.toString() });
    } catch (err) {
        console.error("Error during login : ", err.message);
        res.status(500).send("server error!");
    }
};

async function getAllUsers(req, res) {
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users);

    } catch (err) {
        console.error("Error during fetching : ", err.message);
        res.status(500).send("server error!");
    }
};
async function getUsersProfile(req, res) {
    const currentID = req.params.id;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            _id: new ObjectId(currentID),
        });
        if (!user) {
            return res.status(400).json({ message: "user not found!" });
        }

        res.send(user);
    } catch (err) {
        console.error("Error during fetching : ", err.message);
        res.status(500).send("server error!");
    }
};
async function updateUsersProfile(req, res) {
    const currentID = req.params.id;
    const { email, password } = req.body;
    try {
        let updateFields = { email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");
        const result = await usersCollection.findOneAndUpdate(
            {
                _id: new ObjectId(currentID),
            },
            { $set: updateFields },
            { returnDocument: "after" }
        );
        if (!result) {
            return res.status(404).json({ message: "user not found!" });
        }
        res.send(result);
    } catch (err) {
        console.error("Error during updating : ", err.message);
        res.status(500).send("server error!");
    }
};

async function deleteUsersProfile(req, res) {
    const currentID = req.params.body;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({
            _id: new ObjectId(currentID),
        });
        if (result.deleteCount == 0) {
            return res.status(404).json({ message: "user not found!" });
        }
        res.json({ message: "user profile deleted!" });

    } catch (err) {
        console.error("Error during updating : ", err.message);
        res.status(500).send("server error!");
    }
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUsersProfile,
    updateUsersProfile,
    deleteUsersProfile,
} 