if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}


const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

const initializePassport = require('./passport-config')
const initialize = require('./passport-config')
initializePassport(
    passport,
    email => usersDatabase.find(user => user.email == email)
)


const usersDatabase = []

app.set('view-engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

app.use(passport,initialize())
app.use(passport,session())


app.get('/',(req,res) => {
    res.render('index.ejs')
})

app.get('/login',(req,res) => {
    res.render('login.ejs')
})

app.get('/register',(req,res) => {
    res.render('register.ejs')
})



app.post('/register',async (req,res) => {
    try{
        const id = Date.now().toString()
        const hashedPassword = await bcrypt.hash(req.body.Password,10)
        const name = req.body.Name
        const email = req.body.Email

        console.log(id)
        console.log(hashedPassword)
        console.log(name)
        console.log(email)

        usersDatabase.push(id)
        usersDatabase.push(hashedPassword)
        usersDatabase.push(name)
        usersDatabase.push(email)

        res.redirect('/login')
    }
    catch{
        res.redirect('/register')
    }
    console.log(usersDatabase)
})

app.post('/login',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect: '/login',
    failureFlash:true
}))

app.listen(5000)