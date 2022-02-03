const router = require('express').Router();
const AuthController = require('../controller/Auth.Controller');
const UserController = require('../controller/User.Controller');
const UploadController = require('../controller/Upload.Controller');
const multer = require('multer')
const upload = multer();

//auth gestion
router.post("/register", AuthController.signUp);
router.post("/login", AuthController.signIn);
router.get("/logout", AuthController.logout);

//User gestion 
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserinfo);
router.put("/:id", UserController.udapeUser);
router.delete("/:id", UserController.deleteUser);
router.patch("/follow/:id", UserController.follow);
router.patch("/unfollow/:id", UserController.unfollow);


//gestion d'image
router.post("/upload", upload.single('file'), UploadController.uploaProfil);




module.exports = router;