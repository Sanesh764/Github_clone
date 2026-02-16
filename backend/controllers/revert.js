const fs = require('fs');
const path = require("path");
const {promisify}=require("util");

const readdir=promisify(fs.readdir);
const copyFile=promisify(fs.copyFile);

async function revertRepo(commitId) {
    const repoPath=path.resolve(process.cwd(),".apnaGit");
    const commitsPath=path.join(repoPath,"commits");

    try{
        const commitDir=path.join(commitsPath,commitId);
        const files=await readdir(commitDir);
        const presentDir=path.resolve(repoPath,"..");

        for(const file of files){
            await copyFile(path.join(commitDir,file),path.join(presentDir,file));
        }
        console.log(`commit ${commitId} reverted Successfully!`);
    }catch(err){
        console.error("Unable to revert :",err);
    }
}
module.exports={revertRepo}; 