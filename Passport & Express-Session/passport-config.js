const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport,getUserByEmail)
{
    const authenticateUser = (email,password,done) => {
        const user = getUserByEmail(email)
        if(user == null)
        {
            return done(null,false,{message:"No user with that email"})
        }

        try{
            if( await bcrypt.compare(password,user.password))
            {
                return done(null,user)
            }else
            {
                return done(null,false,{message:"Password incorrect"})
            }
        }catch(e){
            return done(e)
        }
    }


    passport.use(new localStrategy({usernameField:'email'}), authenticateUser)
    passport.serilizeUser((user,done) => { })
    passport.deserilizeUser((id,done) => { })
}

module.exports = initialize