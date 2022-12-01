const { User, Thought } = require('../models');

const userController = {
  getAllUsers(req, res) {
  User.find()
    .select('-__v')
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  getAUser(req, res) {
    User.findOne({ _id: req.params.id })
    .select('-__v')
    .populate('friends')
    .populate('thoughts')
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user found with this id.' });
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  createUser(req, res) {
    User.create(req.body)
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    )
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user found with this id' });
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id.' });
      }
    });
  },

  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id.' });
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id.' });
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },
};

module.exports = userController;