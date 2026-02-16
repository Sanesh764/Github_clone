const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createIssue(req, res) {
    try {
        console.log("Request body:", req.body);
        const { title, description, repository, status } = req.body;
        
        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Issue title is required!" });
        }
        if (!description || !description.trim()) {
            return res.status(400).json({ error: "Issue description is required!" });
        }
        if (!repository) {
            return res.status(400).json({ error: "Repository ID is required!" });
        }
        if (!mongoose.Types.ObjectId.isValid(repository)) {
            return res.status(400).json({ error: "Invalid repository ID format!" });
        }
        
        // Check if repository exists
        const repo = await Repository.findById(repository);
        if (!repo) {
            return res.status(404).json({ error: "Repository not found!" });
        }
        
        const issueData = {
            title: title.trim(),
            description: description.trim(),
            repository: repository,
            status: status || 'open',
        };
        
        console.log("Creating issue with data:", issueData);
        
        const issue = new Issue(issueData);
        const savedIssue = await issue.save();
        
        // Add issue to repository's issues array
        if (!repo.issues) {
            repo.issues = [];
        }
        repo.issues.push(savedIssue._id);
        await repo.save();
        
        res.status(201).json({
            message: "Issue created successfully!",
            issue: savedIssue
        });
    } catch (err) {
        console.error("Error during issue creation:", err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        res.status(500).json({ error: err.message || "server error!" });
    }
}

async function updateIssueById(req, res) {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }
        issue.title = title;
        issue.description = description;
        issue.status = status;

        await issue.save();
        res.json({ message: "issue updated" });
    } catch (err) {
        console.error("Error during issue updation: ", err.message);
        res.status(500).json({ error: err.message || "server error!" });
    }
}

async function deleteIssueById(req, res) {
    const { id } = req.params;
    try {
        const issue = await Issue.findByIdAndDelete(id);
        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }
        res.json({ message: "issue deleted" });

    } catch (err) {
        console.error("Error during deletion: ", err.message);
        res.status(500).json({ error: err.message || "server error!" });
    }
}

async function getAllIssues(req, res) {
    const { id } = req.params;
    try {
        const issues = await Issue.find({ repository: id });
        if (!issues) {
            return res.status(404).json({ error: "Issue not found!" });
        }
        res.status(200).json(issues);

    } catch (err) {
        console.error("Error during get All Issue: ", err.message);
        res.status(500).json({ error: err.message || "server error!" });
    }
}

async function getIssueById(req, res) {
    const { id } = req.params;
    try {
        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }
        res.json(issue);
    } catch (err) {
        console.error("Error during issue retrieval: ", err.message);
        res.status(500).json({ error: err.message || "server error!" });
    }
}

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById,
};