const express = require("express");
const { getUserInfo, deleteUser, updateUsername } = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(verifyToken);

router.get("/me", getUserInfo); 
router.put("/update-name", updateUsername); 
router.delete("/", deleteUser); 

module.exports = router;
