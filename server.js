import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs'

const app = express();
const port = process.argv[2] || 3000;

const users = (()=>{
  try{
    return JSON.parse(fs.readFileSync('./users.json'))
  }catch(e){
    return []
  }
})()


app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { params, body } = req;
  console.log('Params:', JSON.stringify(params));
  console.log('Body:', JSON.stringify(body));
  res.json(body)
});

app.post('/logout', (req, res) => {
  const { params, body } = req;
  console.log('Params:', JSON.stringify(params));
  console.log('Body:', JSON.stringify(body));
  res.json(body)
});

app.post('/signup', (req, res) => {
  const { params, body } = req;
  console.log('Params:', JSON.stringify(params));
  console.log('Body:', JSON.stringify(body));
  const { username , password } = body
  if(users.find(u => u.username === username )){
    console.warn(`${username} already exists`)
    res.status(400).json({
      username,
      message : `User ${username} already exists`
    })
  } else{
    users.push({username, password})
    fs.writeFileSync('./users.json', JSON.stringify(users))
    console.log('success')
    res.json(body)
  }
});

app.get('/users/:username', (req, res) => {
  const { params, body } = req;
  console.log('Params:', JSON.stringify(params));
  console.log('Body:', JSON.stringify(body));
  const { username } = params
  if(users.find(u => u.username === username )){
    let user = {}
    users.forEach( element => {
      if (element.username === username){
        user = {
          username : element.username,
          password : element.password
        }
      }
    });
    console.log('success', user )
    res.status(201).json(user)
  } else{
    console.warn(`${username} is not exists`)
    res.status(400).json({
      username,
      message : `User ${username} is not exists`
    })
  }
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`) );