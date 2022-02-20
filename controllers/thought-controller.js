const { Thought, User } = require('../models');

const thoughtController = {
    // get all thoughts 
    getAllThoughts(req, res) {
        Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }, 

    // get user by id 
    getThoughtById({ params }, res) {
        Thought.findone({_id: params.thoughtId })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thoughts found with this id'});
                return; 
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err); 
            res.status(400).json(err); 
        });
    },

    // add thought
    addThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId }, 
                    { $push: {thoughts: _id } },
                    { new: true }
                ); 
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id'}); 
                    return; 
                }
                res.json(dbUserData); 
            })
            .catch(err => res.status(400).json(err)); 
    }, 

    // update thought 
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with id' }); 
                return;
            }
            res.json(dbTHoughtData); 
        })
        .catch(err => res.status(400).json(err)); 
    },

    // remove thought
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
        .then(deleteThought => {
            if (!deleteThought) {
                return res.status(404).json({ message: 'No thought found with this id' });
            }
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            ); 
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' }); 
                return; 
            }
            res.json(dbUserData); 
        })
        .catch(err => res.json(err)); 
    }, 

    // add reaction 
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found with this id' });
            }
            res.json(dbThoughtData); 
        })
        .catch(err => res.json(err)); 
    }, 

    // remove reaction 
    removeReaction({ params }, res) {
        console.log(params.thoughtId, params.reactionId);
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    }
}; 

module.exports = thoughtController; 