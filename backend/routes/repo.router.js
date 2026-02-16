
const express = require("express");
const repoController = require("../controllers/repoController");

const repoRoute = express.Router();

repoRoute.post("/repo/create", repoController.createRepository);
repoRoute.get("/repo/all", repoController.getAllRepository);
repoRoute.get("/repo/:id", repoController.fetchRepositoryById);
repoRoute.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRoute.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRoute.put("/repo/update/:id", repoController.updateRepositoryById);
repoRoute.patch("/repo/toggle/:id", repoController.toggleVisibilityById);
repoRoute.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRoute.post("/repo/star/:id", repoController.starRepository);
repoRoute.post("/repo/fork/:id", repoController.forkRepository);
repoRoute.get("/repo/star-status/:id", repoController.checkStarStatus);

module.exports = repoRoute;
