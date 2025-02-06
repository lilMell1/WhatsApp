const Group = require('../models/Group');
const User = require('../models/User');

//  create a new group and add it to the user groups
exports.createGroup = async (req, res) => {
    try {
      const { name, description, createDate } = req.body;
      const userId = req.user.id; 
  
      if (!name) {
        return res.status(400).json({ message: "Group name is required." });
      }
  
      const newGroup = new Group({
        name,
        description,
        createDate: new Date(), 
        createdBy: userId,
        members: [userId],
      });
  
      await newGroup.save();
      await User.findByIdAndUpdate(userId, { $push: { groups: newGroup._id } });
  
      res.status(201).json(newGroup);
    } catch (error) {
      console.error("Error in createGroup:", error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

// get all user Friends
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends', 'username phoneNumber');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Error fetching friends", error });
  }
};

// get all groups for the logged in user
exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('groups'); // populate user groups
    res.json(user.groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups', error });
  }
};
