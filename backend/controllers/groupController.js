const Group = require('../models/Group');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) return res.status(400).json({ message: "Group name is required." });

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
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('groups');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups', error });
  }
};

exports.getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate('members', 'username phoneNumber');
    
    if (!group) return res.status(404).json({ message: "Group not found" });

    res.json(group.members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group members', error });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.id;
    // console.log(req.user.id,"left the group");

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.members = group.members.filter(memberId => memberId.toString() !== userId);
    await group.save();

    await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });

    if (group.members.length === 0) {
      await Group.findByIdAndDelete(groupId);
      return res.json({ message: 'Group deleted because all members left' });
    }

    res.json({ message: 'Left group successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving group', error });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    await Group.findByIdAndDelete(groupId);
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting group', error });
  }
};

exports.inviteFriend = async (req, res) => {
  try {
    const { friendId, groupId } = req.body;
    const userId = req.user.id;

    console.log("📌 Incoming Invite Request:");
    console.log("Friend ID:", friendId);
    console.log("Group ID:", groupId);
    console.log("Invited By (User ID):", userId);

    if (!friendId || !groupId) {
      return res.status(400).json({ message: "friendId and groupId are required." });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.members.includes(friendId)) {
      console.error("🚨 User is already in the group:", friendId);
      return res.status(400).json({ message: "User is already in the group" });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      console.error("🚨 Friend not found:", friendId);
      return res.status(404).json({ message: "Friend not found" });
    }

    // Ensure that `groupInvites` exists
    if (!friend.groupInvites) {
      friend.groupInvites = [];
    }

    // Prevent duplicate invites
    const existingInvite = friend.groupInvites.find(invite => invite.groupId.toString() === groupId);
    if (existingInvite) {
      return res.status(400).json({ message: "Invite already sent." });
    }

    friend.groupInvites.push({ groupId, invitedBy: userId });
    await friend.save();

    res.json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("❌ Error sending group invite:", error);
    res.status(500).json({ message: 'Error sending group invite', error });
  }
};

exports.getGroupInvites = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate('groupInvites.groupId', 'name') 
      .populate('groupInvites.invitedBy', 'username'); 

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("📨 Group Invites Found:", user.groupInvites);

    res.json(user.groupInvites);
  } catch (error) {
    console.error("Error fetching group invites:", error);
    res.status(500).json({ message: "Error fetching group invites", error });
  }
};



exports.kickMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.includes(userId)) {
      return res.status(400).json({ message: "User is not in this group" });
    }

    group.members = group.members.filter(member => member.toString() !== userId);
    await group.save();

    await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });

    res.json({ message: "User removed from group" });
  } catch (error) {
    res.status(500).json({ message: 'Error kicking user', error });
  }
};

exports.acceptGroupInvite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "User is already in the group" });
    }

    group.members.push(userId);
    await group.save();

    await User.findByIdAndUpdate(userId, { $push: { groups: groupId }, $pull: { groupInvites: { groupId } } });

    res.json({ message: "Group invitation accepted" });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting group invite', error });
  }
};

exports.declineGroupInvite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.body;

    await User.findByIdAndUpdate(userId, { $pull: { groupInvites: { groupId } } });

    res.json({ message: "Group invitation declined" });
  } catch (error) {
    res.status(500).json({ message: 'Error declining group invite', error });
  }
};
