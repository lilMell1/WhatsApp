const Group = require('../models/Group');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name.trim()) return res.status(400).json({ message: "Group name is required." });

    const newGroup = new Group({
      name,
      description,
      createdBy: userId,
      members: [userId],
      isActive: true
    });

    await newGroup.save();
    await User.findByIdAndUpdate(userId, { $push: { groups: newGroup._id } });

    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: 'groups',
      match: { isActive: true } 
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: 'Error fetching groups', error });
  }
};


exports.getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate('members', 'username phoneNumber isActive');

    if (!group || !group.isActive) return res.status(404).json({ message: "Group not found or inactive" });

    const activeMembers = group.members.filter(member => member.isActive);

    res.json(activeMembers);
  } catch (error) {
    console.error("Error fetching group members:", error);
    res.status(500).json({ message: 'Error fetching group members', error });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group || !group.isActive) return res.status(404).json({ message: 'Group not found or inactive' });

    group.members = group.members.filter(memberId => memberId.toString() !== userId);
    await group.save();

    await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });

    if (group.members.length === 0) {
      group.isActive = false; // change it to inactive
      await group.save();
      return res.json({ message: 'Group deactivated because all members left' });
    }

    res.json({ message: 'Left group successfully' });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ message: 'Error leaving group', error });
  }
};


exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.isActive = false; 
    await group.save();

    res.json({ message: 'Group deactivated successfully' });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ message: 'Error deleting group', error });
  }
};

exports.inviteFriend = async (req, res) => {
  try {
    const { friendId, groupId } = req.body;
    const userId = req.user.id;

    if (!friendId || !groupId) {
      return res.status(400).json({ message: "friendId and groupId are required." });
    }

    const group = await Group.findById(groupId);
    if (!group || !group.isActive) return res.status(404).json({ message: "Group not found or inactive" });

    const friend = await User.findById(friendId);
    if (!friend || !friend.isActive) return res.status(404).json({ message: "Friend not found or inactive" });

    if (group.members.includes(friendId)) return res.status(400).json({ message: "User is already in the group" });

    const existingInvite = friend.groupInvites.find(invite => invite.groupId.toString() === groupId);
    if (existingInvite) return res.status(400).json({ message: "Invite already sent." });

    friend.groupInvites.push({ groupId, invitedBy: userId });
    await friend.save();

    res.json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Error sending group invite:", error);
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

    // console.log("📨 Group Invites Found:", user.groupInvites);

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
    if (!group || !group.isActive) return res.status(404).json({ message: "Group not found or inactive" });

    if (!group.members.includes(userId)) return res.status(400).json({ message: "User is not in this group" });

    group.members = group.members.filter(member => member.toString() !== userId);
    await group.save();

    await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });

    if (group.members.length === 0) {
      group.isActive = false;
      await group.save();
    }

    res.json({ message: "User removed from group" });
  } catch (error) {
    console.error("Error kicking user:", error);
    res.status(500).json({ message: 'Error kicking user', error });
  }
};

exports.acceptGroupInvite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.body;

    const group = await Group.findById(groupId);
    if (!group || !group.isActive) return res.status(404).json({ message: "Group not found or inactive" });

    if (group.members.includes(userId)) return res.status(400).json({ message: "User is already in the group" });

    group.members.push(userId);
    await group.save();

    await User.findByIdAndUpdate(userId, { 
      $push: { groups: groupId }, 
      $pull: { groupInvites: { groupId } } 
    });

    res.json({ message: "Group invitation accepted" });
  } catch (error) {
    console.error("Error accepting group invite:", error);
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
    console.error("Error declining group invite:", error);
    res.status(500).json({ message: 'Error declining group invite', error });
  }
};