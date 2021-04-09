// Import required modules
const express = require(`express`);
const app = express();
const path = require(`path`);
const fileUpload = require(`express-fileupload`);



// Use middleware functions
app.use(express.static(`public`));
app.use(fileUpload({
  useTempFiles: false
}));


app.set('view engine', 'ejs');

// Use route functions
app.get('/', (req, res, next) => {
  res.render('index');
});



app.post('/upload', (req, res, next) => {

  let file = req.files.file;
  let size = 100 * 1024 * 1024;


  // Determine the path
  let dir;
  let filePath;

  let imagePath = `images/img-${Date.now()}${path.parse(file.name).ext}`;
  let videoPath = `videos/vid-${Date.now()}${path.parse(file.name).ext}`;
  
  let imageDirectory = `${__dirname}/public/${imagePath}`;
  let videoDirectory = `${__dirname}/public/${videoPath}`;
  
  
  // Determine the mimetype
  if (file.mimetype.startsWith('image')) {
    dir = imageDirectory;
    filePath = imagePath;
  }
  else if (file.mimetype.startsWith('video')) {
    dir = videoDirectory;
    filePath = videoPath
  }
  else {
    throw new Error('Choose photo or video.');
  }


  // Determine the size
  if (file.size > size) {
    throw new Error('OPS!!!, Over size.');
  }


  // Upload file or video
  file.mv(dir, (error) => {
    if (error) {
      throw new Error(error);
    }
    res.status(201).render('file', {
      fileName: file.name,
      filePath: filePath
    });
  });
});



// Insert port that server will listen to
const port = process.env.PORT || 3000;
app.listen(port, console.log(`server listening to port ${port} ...`));