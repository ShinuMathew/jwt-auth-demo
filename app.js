const express = require('express'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json())

let testcases = []
let credentials = [{
    username : "Shinu",
    password : "shinz1234"
}]
const cypherKey = "awer678hvde35anfdbs77dg35dgf37d85gh535dvdhf5vdhy4ygd4ud34="

app.get('/testcases', (req, res) => {
    res.json(testcases)
})

app.post('/testcases', verifyToken,(req, res) => {
    jwt.verify(req.token, cypherKey, (error, authData) => {
        if(error){
            res.sendStatus(403)
        } else {
            let body = req.body
            console.log(body)
            testcases.push(body)            
            res.status(200).json({
                message : `Added tc case ${body.tc_name} successfully`,
                authData
            })
        }
    })    
})

app.post('/login', (req, res) => {
    let body = req.body
    let user = {
        username : body.username,
        password : body.password
    }
    let expectedCreds = credentials.filter(u => u.username == user.username)[0] 
    console.log(expectedCreds)
    if(typeof expectedCreds !== 'undefined') {
        if(expectedCreds.password == user.password) {
            jwt.sign({user}, cypherKey, {expiresIn : '30s'}, (err, token)=>{
                res.json({token})
            })
        } else {
            res.status(401).json({
                status: 401,
                message : "Unauthorized Login. Incorrect Password"
            })
        }        
    } else {
        res.status(401).json({
            status: 401,
            message : "Unauthorized Login"
        })
    }
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader != 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        console.log(bearerToken)
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(403)
    }
}

app.listen(5001, () => console.log("Server started at 5001"))