/**
 * Created by zeeshanhanif on 4/15/2016.
 */

var express = require('express');
var fs = require('file-system');
var bodyparser = require('body-parser');
var path = require('path');
var S3FS = require('s3fs');
var s3fsImpl = new S3FS('nameOfTheBucket',{
    accessKeyId: 'your awss access key id from /security',
    secretAccessKey: 'your awss access key id from /security'
})
//this will create a bucket
s3fsImpl.create();

var multiparty = require('connect-multiparty');
    multipartyMiddleware = multiparty()

//Data parser and static path
var app = express();
//middleware for multiparty
app.use(multipartyMiddleware);
//addingUsers(app);
app.set('port', process.env.PORT || 3000);
var staticFilesPath = path.resolve(__dirname, "client");
app.use(express.static(staticFilesPath));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
//Routes
app.get('/', function (req, res) {
    var mainFile = path.resolve(__dirname, 'client/index.html');
    res.sendFile(mainFile);
});


app.post('/imageUpload', function (req, res) {
    var file = req.files.file;
    var stream = fs.createReadStream(file.path)
    return s3fsImpl.writeFile(file.originalFilename,stream).then(function(){
        fs.unlink(file.path, function(err){
            if(err){
                console.log(err);
            }
        })
        res.send({status: 200,statusMsg:'aws worked'})
    })
});

app.use(errorHandler3);
function errorHandler3(err, req, res, next) {
    res.send("<h2 style = 'color: red;'>" + err + "</h2>");
}
// app.get('/h', (req, res)=> {
//     let helloFile = path.resolve(__dirname, './static/hello.html')
//     res.sendFile(helloFile);
// });
// app.get('/about', (req, res)=> {
//     let aboutFile = path.resolve(__dirname,'static/about.html')
//     res.sendFile(aboutFile);
// });
//App listener
app.listen(app.get('port'), function () {
    console.log('app is listening on port ' + app.get('port'));
});
