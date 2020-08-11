var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var app = express();
app.get('/',(req,res)=>{ 
    res.sendFile(__dirname+'/index.html');
});
var storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        if(!fs.existsSync(path.join(__dirname,'/uploads'))){
            fs.mkdir('./uploads',(err)=>{
                if(err){
                    console.log(err.message);
                }
            })
        }
        callback(null,path.join(__dirname,'/uploads'));
    },
    filename: (req, file, callback) =>{
        callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({ 
    storage : storage,
    fileFilter:(req,res,callback) => {
    var ext = path.extname(file.originalname);
    if(ext !== '.PNG' && ext !== '.JPG' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
}});
app.post('/api/file',upload.single('userFile'),function(req,res){
    const file = req.file;
    if(!file){
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file);
});
app.listen(3000, ()=>{
    console.log("working on port 3000");
})