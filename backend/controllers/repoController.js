//isme mongoose use kiye hai dono ko samjhne ke liye
const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createRepository(req, res) {
    const { owner, name, issues, content, description, visibility } = req.body;
    try {
        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Repository name is required!" });
        }
        
        const trimmedName = name.trim();
        
        // Basic validation
        if (trimmedName.length < 1) {
            return res.status(400).json({ error: "Repository name cannot be empty!" });
        }
        
        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Invalid user ID!" });
        }
        
        // Check if user exists
        const user = await User.findById(owner);
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        
        // Check if repository name already exists
        const existingRepo = await Repository.findOne({ name: trimmedName });
        if (existingRepo) {
            return res.status(400).json({ error: `Repository name "${trimmedName}" already exists! Please choose a different name.` });
        }
        
        const newRepository = new Repository({
            name: trimmedName,
            description: description ? description.trim() : '',
            visibility: visibility !== undefined ? visibility : true,
            owner,
            content: content || [],
            issues: issues || [],
            stars: 0,
            starredBy: [],
            forks: 0,
            forkedFrom: null,
            watchers: 0,
        });
        
        const result = await newRepository.save();
        
        // Add repository to user's repositories array
        user.repositories.push(result._id);
        await user.save();
        
        res.status(201).json({
            message: "Repository created successfully!",
            repositoryID: result._id,
        });
    } catch (err) {
        console.error("Error during repository creation: ", err.message);
        // Handle duplicate name error (MongoDB unique index)
        if (err.code === 11000 || err.message.includes('duplicate') || err.message.includes('E11000')) {
            return res.status(400).json({ error: "Repository name already exists! Please choose a different name." });
        }
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        res.status(500).json({ error: err.message || "server error!" });
    }
}

async function getAllRepository(req, res) {
    try {
        const repositories = await Repository.find({})
            .populate("owner")
            .populate("issues");
        res.status(200).json(repositories);
    } catch (err) {
        console.error("Error during fetching repositories: ", err.message);
        res.status(500).send("server error!");
    }
};

async function fetchRepositoryById(req, res) {
    const { id } = req.params;
    try {
        const repository = await Repository.find({ _id: id })
            .populate("owner")
            .populate("issues");
        res.status(200).json(repository);
    } catch (err) {
        console.error("Error during fetching repositories: ", err.message);
        res.status(500).send("server error!");
    }
};

async function fetchRepositoryByName(req, res) {
    const { name } = req.params;
    try {
        const repository = await Repository.find({ name })
            .populate("owner")
            .populate("issues");
        res.status(200).json(repository);
    } catch (err) {
        console.error("Error during fetching repositories: ", err.message);
        res.status(500).send("server error!");
    }
}
async function fetchRepositoriesForCurrentUser(req, res) {
    const { userID } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ error: "Invalid user ID!" });
        }
        const repositories = await Repository.find({ owner: userID })
            .populate("owner")
            .populate("issues");
        res.json({ message: "Repositories found !", repositories: repositories || [] });
    } catch (err) {
        console.error("Error fetching user repositories: ", err.message);
        res.status(500).json({ error: "server error!" });
    }
};

async function updateRepositoryById(req, res) {
    const { id } = req.params;
    const { content, description } = req.body;
    try {
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "repository not found!" });
        }
        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();
        res.json({
            message: "Repository updated successfully!",
            repository: updatedRepository,
        });

    } catch (err) {
        console.error("Error during updating repositories: ", err.message);
        res.status(500).send("server error!");
    }
}

async function toggleVisibilityById(req, res) {
    const { id } = req.params;
    try {
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "repository not found!" });
        }
        repository.visibility = !repository.visibility;

        const updatedRepository = await repository.save();
        res.json({
            message: "Repository visibility toggled successfully!",
            repository: updatedRepository,
        });

    } catch (err) {
        console.error("Error during toggling visibility: ", err.message);
        res.status(500).send("server error!");
    }
}

async function deleteRepositoryById(req, res) {
    const { id } = req.params;
    try {
        const repository = await Repository.findByIdAndDelete(id);
        if (!repository) {
            return res.status(404).json({ error: "repository not found!" });
        }
        res.json({ message: "Repository deleted successfully!" });
    } catch (err) {
        console.error("Error during deleting repository: ", err.message);
        res.status(500).send("server error!");
    }
}

async function starRepository(req, res) {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID!" });
        }
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found!" });
        }
        
        const isStarred = repository.starredBy.some(
            (starId) => starId.toString() === userId
        );
        
        if (isStarred) {
            // Unstar
            repository.starredBy = repository.starredBy.filter(
                (starId) => starId.toString() !== userId
            );
            repository.stars = Math.max(0, repository.stars - 1);
            await repository.save();
            res.json({ message: "Repository unstarred!", starred: false, stars: repository.stars });
        } else {
            // Star
            repository.starredBy.push(userId);
            repository.stars = repository.stars + 1;
            await repository.save();
            res.json({ message: "Repository starred!", starred: true, stars: repository.stars });
        }
    } catch (err) {
        console.error("Error during starring repository: ", err.message);
        res.status(500).json({ error: "server error!" });
    }
}

async function forkRepository(req, res) {
    const { id } = req.params;
    const { owner, name } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Invalid user ID!" });
        }
        if (!name) {
            return res.status(400).json({ error: "Repository name is required!" });
        }
        
        const originalRepo = await Repository.findById(id);
        if (!originalRepo) {
            return res.status(404).json({ error: "Repository not found!" });
        }
        
        // Check if name already exists
        const existingRepo = await Repository.findOne({ name, owner });
        if (existingRepo) {
            return res.status(400).json({ error: "Repository name already exists!" });
        }
        
        const forkedRepo = new Repository({
            name,
            description: originalRepo.description,
            visibility: originalRepo.visibility,
            owner,
            content: [...originalRepo.content],
            issues: [],
            stars: 0,
            starredBy: [],
            forks: 0,
            forkedFrom: originalRepo._id,
            watchers: 0,
        });
        
        // Increment fork count on original repository
        originalRepo.forks = (originalRepo.forks || 0) + 1;
        await originalRepo.save();
        
        const result = await forkedRepo.save();
        res.status(201).json({
            message: "Repository forked successfully!",
            repositoryID: result._id,
            repository: result,
        });
    } catch (err) {
        console.error("Error during forking repository: ", err.message);
        res.status(500).json({ error: "server error!" });
    }
}

async function checkStarStatus(req, res) {
    const { id } = req.params;
    const { userId } = req.query;
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID!" });
        }
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found!" });
        }
        
        const isStarred = repository.starredBy.some(
            (starId) => starId.toString() === userId
        );
        
        res.json({ starred: isStarred, stars: repository.stars || 0 });
    } catch (err) {
        console.error("Error checking star status: ", err.message);
        res.status(500).json({ error: "server error!" });
    }
}

module.exports = {
    createRepository,
    getAllRepository,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById,
    starRepository,
    forkRepository,
    checkStarStatus,
} 