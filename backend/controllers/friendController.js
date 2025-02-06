const User = require('../models/User');

// get user friends
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends', 'username phoneNumber');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Error fetching friends", error });
  }
};

// send friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const { userId, phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required." });
    }

    const recipient = await User.findOne({ phoneNumber });
    if (!recipient) {
      return res.status(404).json({ message: "User not found." });
    }

    if (recipient._id.toString() === userId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    // Check if request already exists
    if (recipient.friendRequests?.some(req => req.toString() === userId)) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    // Add friend request
    await User.findByIdAndUpdate(recipient._id, { $push: { friendRequests: userId } });

    res.json({ message: "Friend request sent successfully." });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// get friend requests
exports.getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friendRequests', 'username phoneNumber');
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json(user.friendRequests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ message: "Error fetching friend requests", error });
  }
};

// accept Friend Request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { userId, requestId } = req.body;

    const user = await User.findById(userId);
    const sender = await User.findById(requestId);

    if (!user || !sender) return res.status(404).json({ message: "User not found." });

    if (!user.friendRequests.includes(requestId)) {
      return res.status(400).json({ message: "Friend request not found." });
    }

    // Add to friends list
    user.friends.push(requestId);
    sender.friends.push(userId);

    // Remove from friend requests
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);

    await user.save();
    await sender.save();

    res.json({ message: "Friend request accepted." });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Error accepting friend request", error });
  }
};

// deny friend request
exports.denyFriendRequest = async (req, res) => {
  try {
    const { userId, requestId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
    await user.save();

    res.json({ message: "Friend request denied." });
  } catch (error) {
    console.error("Error denying friend request:", error);
    res.status(500).json({ message: "Error denying friend request", error });
  }
};

// remove Friend
exports.removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ message: "User not found." });

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.json({ message: "Friend removed successfully." });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Error removing friend", error });
  }
};
