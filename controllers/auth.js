const express = require('express');
const router = express.Router();
const passport = require('../config/ppConfig');
const { user } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const multer = require('multer');
const path = require('path');



router.get("/signup", (req, res) => {
  return res.render("auth/signup");
});

router.get("/login", (req, res) => {
  return res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/',
  successFlash: 'Welcome back ...',
  failureFlash: 'Either email or password is incorrect' 
}));

router.post('/signup', async (req, res) => {
  // we now have access to the user info (req.body);
  const { email, name, password } = req.body; // goes and us access to whatever key/value inside of the object
  try {
    const [_user, created] = await user.findOrCreate({
        where: { email },
        defaults: { name, password }
    });

    if (created) {
        // if created, success and we will redirect back to / page
        console.log(`----- ${_user.name} was created -----`);
        const successObject = {
            successRedirect: '/',
            successFlash: `Welcome ${_user.name}. Account was created and logging in...`
        }
        // 
        passport.authenticate('local', successObject)(req, res);
    } else {
      // Send back email already exists
      req.flash('error', 'Email already exists');
      res.redirect('/auth/signup'); // redirect the user back to sign up page to try again
    }
  } catch (error) {
        // There was an error that came back; therefore, we just have the user try again
        console.log('**************Error');
        console.log(error);
        req.flash('error', 'Either email or password is incorrect. Please try again.');
        res.redirect('/auth/signup');
  }
});

router.get('/logout', (req, res) => {
  req.logOut(function(err, next) {
    if (err) {
      return next(err);
    }
      req.flash('success', 'Logging out... See you next time!');
      res.redirect('/');

  })
});


// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/profile') // File destination folder
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`) // Filename
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{ fileSize: 10000000 }, // Increase limit to 5 MB
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('profilePic');


// Check File Type
function checkFileType(file, cb){
  // Allowed extensions
  const filetypes = /jpeg|jpg|png/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

router.post('/profile-upload', isLoggedIn, function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      console.log('Error uploading file:', err);
      req.flash('error', 'Error uploading file');
      return res.redirect('/profile');
    } else {
      // Save the path to the image in our User model
      const profilePicPath = `/uploads/profile/${req.file.filename}`;
      req.user.update({ profilePic: profilePicPath }).then(() => {
        req.flash('success', 'Profile picture updated successfully');
        return res.redirect('/profile');
      }).catch((err) => {
        console.log('Error updating user model:', err);
        req.flash('error', 'Error updating user profile');
        return res.redirect('/profile');
      });
    }
  });
});




module.exports = router;