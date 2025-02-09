const User = require('../models/User');


exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId).populate('friends', 'username phoneNumber');

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Error fetching friends", error });
  }
};

exports.getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId).populate('friendRequests', 'username phoneNumber');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend requests", error });
  }
};


exports.sendFriendRequest = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const userId = req.user.id; // ✅ Get user ID from token

    const sender = await User.findById(userId);
    const receiver = await User.findOne({ phoneNumber });

    if (!receiver) return res.status(404).json({ message: "User not found" });
    if (receiver.friendRequests.includes(userId)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    receiver.friendRequests.push(userId);
    await receiver.save();

    res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending friend request", error });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id; // ✅ Get user ID from token

    if (!friendId) return res.status(400).json({ message: "Friend ID is required." });

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ message: "User or Friend not found" });

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing friend", error });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    // find both users
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
    }

    if (!friend.friends.includes(userId)) {
      friend.friends.push(userId);
    }

    // remove the request after accepting
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
    friend.friendRequests = friend.friendRequests.filter(id => id.toString() !== userId);

    // save changes
    await user.save();
    await friend.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Error accepting friend request", error });
  }
};


exports.denyFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id; // ✅ Get user ID from token

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
    await user.save();

    res.json({ message: "Friend request denied" });
  } catch (error) {
    res.status(500).json({ message: "Error denying friend request", error });
  }
};
