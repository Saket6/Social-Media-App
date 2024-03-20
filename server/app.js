const express=require('express');
require('dotenv').config();
const cors=require('cors');
const path=require('path');
const fs = require('fs');
const Router=require('./Routes/Routes')
const cookieParser = require('cookie-parser');
const conn=require('./conn/conn');
const socket=require('./socket');
const auth=require('./middleware/auth');
conn();



const app=express();
app.use(cookieParser());
app.use(express.json());
const corsOptions = {
  origin: 'https://social-media-app-1-n8hx.onrender.com',
  credentials: true,
};
app.use(cors(corsOptions));


app.use('/assets', express.static(path.join(__dirname,'./public/assets')));

const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, './public/assets'); // Adjust the path as needed
    fs.mkdir(uploadDir, { recursive: true }, function (err) {
        if (err) {
            console.error('Error creating directory:', err);
        }
        cb(null, uploadDir);
    });
},
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = path.extname(file.originalname);
      const type=file.mimetype;
      req.filetype=type;
      console.log("type of file: ",type);
      const filename=file.fieldname + '-' + uniqueSuffix+ext;
      req.generatedFilename=filename;
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })


app.post('/profile', upload.single('profile'), function (req, res, next) {
   
   console.log("registration ")
    return res.json({"filename": req.generatedFilename, "filetype": req.filetype});
  })

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
  

app.get('/',auth ,(req,res)=>
{

    res.send("Home Page");
})

app.use(Router);








//socket.io 

const server=require('http').createServer(app);
socket(server);


// app.listen(process.env.PORT,(req,res)=>
// {
//     console.log(`Server listening on ${process.env.PORT}`);
// });