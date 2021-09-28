const { response } = require('express');
const express  = require('express');
const app = express();
const morgan = require('morgan')
const port = 4000;
const {Pool} = require('pg')

const connectionData = {
  user: 'postgres',
  host: 'localhost',
  database: 'Prueba',
  password: '1234',
}

let database = new Pool(connectionData);

database.connect()

app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) =>{
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>|
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BD</title>
  </head>
  <body>
      <form action="/into/get" method="GET">
          <input type="submit" value="Get">
      </form>
      <form action="/into/add" method="POST">
      <label for="add">Add:</label>
      <input type="text" name="add" id="add">
      <input type="submit" value="Add">
      </form>
      <form action="/into/delete" method="POST">
      <label for="delete">Delete:</label>
      <input type="text" name="delete" id="delete">
      <input type="submit" value="delete">
      </form>

      <form action="/into/update" method="POST">
      <label for="oldValue">oldValue:</label>
      <input type="text" name="oldValue" id="oldValue">
      <label for="newValye">New Value:</label>
      <input type="text" name="newValue" id="newValue">
      <input type="submit" value="UPDATE">
      </form>
  </body>
  </html>`);
})

app.get('/into/get', (req, res) => {
  try{
    database.connect(async(error,client, release)=>{
    let resp = await client.query(`SELECT * from test`);
      res.send(resp.rows);

    })
  }catch(error){
    console.log(error);
  }
})

app.post('/into/add', (req, res) => {
  try{
    database.connect(async(error,client, release)=>{
    let resp = await client.query(`INSERT INTO test (name) VALUES ('${req.body.add}')`);
      res.redirect('/into/get');
    })
  }catch(error){
    console.log(error);
  }
})

app.post('/into/delete', (req, res) => {
  try{
    database.connect(async(error,client, release)=>{
    let resp = await client.query(`DELETE FROM test WHERE name = '${req.body.delete}'`);
      res.redirect('/into/get');
    })
  }catch(error){
    console.log(error);
  }
})

app.post('/into/update', (req, res) => {
  try{
    database.connect(async(error,client, release)=>{
    let resp = await client.query(`UPDATE test SET name = '${req.body.newValue}' WHERE name = '${req.body.oldValue}'`);
      res.redirect('/into/get');
    })
  }catch(error){
    console.log(error);
  }
})

app.listen(port, () =>{
  console.log(`Conectado al puerto ${port}`)
})

