const User = require('../models/User');
const Group = require('../models/Group');  
const Message = require('../models/Message');

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("username isActive");

    if (!user || !user.isActive) {
      return res.status(404).json({ message: "User not found or inactive" });
    }

    res.json({ username: user.username });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      return res.status(404).json({ message: "User not found or already inactive" });
    }

    user.isActive = false;
    await user.save();

    // remove user from all groups
    const groups = await Group.find({ members: userId }) || [];
    for (const group of groups) {
      group.members = group.members.filter(member => member.toString() !== userId);
      if (group.members.length === 0) {
        group.isActive = false;
      }
      await group.save();
    }

    
    await Message.updateMany({ sender: userId }, { isActive: false });

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
};

exports.updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    if (!username.trim()) return res.status(400).json({ message: "New username is required" });

    const user = await User.findById(userId);
    if (!user || !user.isActive) return res.status(404).json({ message: "User not found or inactive" });

    user.username = username;
    await user.save();

    res.json({ message: "Username updated successfully" });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "Error updating username", error });
  }
};
