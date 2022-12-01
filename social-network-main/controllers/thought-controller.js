const { Thought, User } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find()
    .sort({ createdAt: -1 })
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  getAThought(req, res) {
    Thought.findOne({ _id: req.params.id })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id.' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  createThought(req, res) {
    Thought.create(req.body)
    .then((dbThoughtData) => {
      return User.findOneAndUpdate(
        { _id: req.body.id },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );
    })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: 'Thought created, but no user with this id.' });
      }
      res.json({ message: 'Thought created.' });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought found with this id.' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id.' });
      }
      return User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
    })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'Thought created, but no user with this id' });
      }
      res.json({ message: 'Thought deleted.' });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: true }
    )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { id: req.params.id } } },
      { new: true, runValidators: true }
    )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },
};

module.exports = thoughtController;