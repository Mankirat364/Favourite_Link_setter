import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import googleUser from '../models/googleUser.js'

dotenv.config()

passport.use(
    new GoogleStrategy(
        {
            clientID : process.env.GOOGLE_CLIENT_ID,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
            scope: ["profile", "email"],
        },
        async (accessToken , refreshToken, profile,done) => {
            try {
                let user = await googleUser.findOne({googleId : profile.id});

                if(!user){
                    user = await googleUser.create({
                        googleId : profile.id,
                        name : profile.displayName,
                        email : profile.emails[0].value,
                        picture : profile.photos[0].value,
                    })

                }
                const token = jwt.sign( {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture, 
                },
                process.env.JWT_SECRET,)
                return done(null , {user,token})
            } catch (error) {
                    return done(error,null)
            }
        }
    )
)

passport.serializeUser((user,done) =>{
    done(null,user);
})
passport.deserializeUser((user,done) =>{
    done(null,user);
})