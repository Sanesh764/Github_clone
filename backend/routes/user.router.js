
const express=require("express");
const userController=require("../controllers/userController");

const userRoute=express.Router();

userRoute.get("/allUsers",userController.getAllUsers);
userRoute.post("/signup",userController.signup);
userRoute.post("/login",userController.login);
userRoute.get("/userProfile/:id",userController.getUsersProfile);
userRoute.put("/updateProfile/:id",userController.updateUsersProfile);
userRoute.delete("/deleteProfile/:id",userController.deleteUsersProfile);

module.exports=userRoute;
