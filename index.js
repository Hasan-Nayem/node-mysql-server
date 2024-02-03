const express = require('express');
const cors = require('cors');
const mysql = require('mysql')
const app = express();
const port = process.env.PORT | 5000;
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'node_server',

});

connection.connect(err=> {
    if(err){
        console.log("error connecting to database - ", err)
    }
    console.log("Database connected successfully")
});

app.get('/', (req, res)=> {
    res.send('Sarver running');
});

app.get('/get/users', (req, res) => {
    const query = "SELECT * FROM users";
    connection.query(query, (error, result)=> {
        if(error){ 
            console.log("Error ocurred - ", error);
            return res.status(500).send({message : error});
        }
        console.log(result)
        return res.status(201).send({message: "Success retriving data", data: result})
    });
});

app.post('/add/user', (req, res)=> {
    const {name, email, password} = req.body;
    console.log(name, email, password);
    console.log(req.body);
    const query = "INSERT INTO users (name, email, password) VALUES (?,?,?)";
    connection.query(query, [name, email, password], (error, result)=> {
        if(error){
            console.log(error)
            res.status(500).send({message: `error creating user ${error}`});
        }
        return res.status(201).send({message: "Success creating user", insertId: result.insertId})
    });
});

app.listen(port , ()=> {
    console.log("Listening to server at port number - ", port);
});
