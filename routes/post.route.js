const router = require('express').Router();
const PostController = require('../controller/Post.Controller');
const multer = require('multer')
const upload = multer();

router.get('/', PostController.readPost);
router.get('/:id', PostController.getPost);
router.post('/', upload.single('file'), PostController.createPost);
router.put('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);
//les likes et dislikes 
router.patch('/like-post/:id', PostController.likePost);
router.patch('/unlike-post/:id', PostController.unlikePost);

//les commentaires
router.patch('/comment-post/:id', PostController.CommentPost);
router.patch('/edit-comment-post/:id', PostController.editCommentPost);
router.patch('/delete-comment-post/:id', PostController.deleteCommentPost);



module.exports = router;