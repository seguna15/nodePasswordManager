const express = require('express')
const dotenv = require("dotenv");
const {uuid} = require("uuidv4");
const app = express()

const cors = require('cors')
const bodyparser = require("body-parser");
const {encrypt, decrypt} = require('./EncryptionHandler')

const connectDB = require("./connection");

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 3001;



app.use(cors())
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  }));

//mongodb connection
connectDB();

let Passworddb = require("./model");

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.post("/addPassword", (req, res) => {
    const {password, title} = req.body;
    const hashedPassword = encrypt(password);
    

     const servicePassword = new Passworddb({
       password: hashedPassword.password,
       title: title,
       slug: uuid(),
       iv: hashedPassword.iv,
     });

      servicePassword
        .save(servicePassword)
        .then((data) => {
          //res.send(data)
           res.send("Success");
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occured while creating a create operation",
          });
        }); 
    
});

app.get('/showPasswords', (req, res) => {

    Passworddb.find()
      .then((password) => {
        res.send(password);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error while retrieving password information",
        });
      });
    /* db.query('SELECT * FROM passwords;', (err, result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result);
        }
    }); */
});

app.post('/decryptpassword', (req, res) => {
    res.send(decrypt(req.body))
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})