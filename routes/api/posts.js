const express = require('express'); //get express
const router = express.Router(); //to set up routes
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  POST api/posts
// @desc   Create a post
// @access Private (no token needed)
router.post('/', [auth, [
    check('text', 'Text is required')
        .not()
        .isEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        const post = new Post(newPost)
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET api/posts
// @desc   Get all Posts
// @access Private (no token needed)
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  GET api/posts/:id
// @desc   Get Post by id
// @access Private (no token needed)
router.get('/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
})

// @route DELETE api/posts/:id
// @desc  Delete post by id
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // Check user
        if (post.user.toString() !== req.user.id) { //post.user is not a string by default!
            return res.status(401).json({ msg: 'User not authorized'})
        }

        await post.remove();

        res.json({ msg: 'Post removed'})
    } catch (err) {
        console.errors(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
})

// @route PUT api/posts/like/:post_id
// @desc  Like a post
// @access Private 
router.put('/likes/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        // Check if post alreay has a like from the user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id })

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route PUT api/posts/unlike/:post_id
// @desc  Remove the like from a post
// @access Private
router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        // Check to see if user has liked the post
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }

        // Get remove Index
        const removeIdx = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        // Remove from likes array
        post.likes.splice(removeIdx, 1);

        // Save post
        await post.save();

        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route POST api/posts/comment/:post_id
// @desc  Add a comment to a post
// @access Private
router.post('/comment/:post_id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const post = await Post.findById(req.params.post_id);
        const user = await User.findById(req.user.id).select('-password');

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        // add comment object to post
        post.comments.unshift(newComment);

        // save post
        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.errors(err.message);
        res.status(500).json('Server Error');
    }
})

// @route  DELETE api/posts/comment/:post_id/:comment_id
// @desc   Delete comment
// @access Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        // Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }

        // Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' }); 
        };

        const removeIdx = post.comments.map(comment => comment.id).indexOf(comment.id);
        post.comments.splice(removeIdx, 1);

        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
module.exports = router;