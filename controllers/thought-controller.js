const { user, thought, reaction } = require('../models');

const thoughtController = {

    //get all thoughts
    getAllThoughts(req, res) {
        thought.find({})
            .populate({
                path: 'user',
                select: '-__v'
            })

            .select('-__v')
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err)
            });
    },

    //get one thoughts
    getThoughtById({ params }, res) {
        thought.findOne({ _id: params.id })
            .populate({
                path: 'user',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err)
            })
    },

    //create thought *
    createThought({ params, body }, res) {
        thought.create(body)
            .then(dbThoughtData => {
                user.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: dbThoughtData._id } },
                    { new: true }
                )
                    .then(dbUserData => {
                        if (!dbUserData) {
                            res.status(404).json({ message: 'No matching data' });
                            return;
                        }
                        res.json(dbUserData);
                    })
                    .catch(err => res.json(err));
            })
            .catch(err => res.status(400).json(err));
    },


    //delete a thought *

    deleteThought({ params, body }, res) {
        thought.findOneAndDelete({ _id: params.id })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No matching data' })
                }
                res.json(deletedThought);
            })
            .catch(err => res.json(err));
    },


    //update a thought 

    updateThought({ params, body }, res) {
        thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No matching data' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },


    //add reaction

    addReaction({ params, body }, res) {
        thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No matching data' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(500).json(err));
    },

    //delete reaction

    deletedReaction({ params, body }, res) {
        thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No matching data' });
                    return;
                }
                res.json((deletedReaction),{ message: 'Successful' });
            })
            .catch(err => res.status(500).json(err));
    },

};

module.exports = thoughtController;

