const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AuthRepository = require("../repositories/auth.repository");

class AuthService{

    async login(data){

        const user = await AuthRepository.findByEmail(data.email);

        if(!user){

            throw new Error("Email tidak ditemukan");

        }

        const valid = await bcrypt.compare(data.password,user.password);

        if(!valid){

            throw new Error("Password salah");

        }

        const token = jwt.sign({

            id:user.id,
            role:user.role

        },process.env.JWT_SECRET,{
            expiresIn:"1d"
        });

        return{

            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role
            },

            token

        }

    }

}

module.exports = new AuthService();