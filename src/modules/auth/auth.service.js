const User = require("./auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async ({fullName, email, password, role, age, gender, phone, address}) => {
    const existing = await User.findOne({email})
    if(existing) throw new Error("User already exists")


    const hashedPassword = await bcrypt.hash(password, 10)
     const user = await User.create({ 
        fullName,
        email,
        password: hashedPassword,
        role,     
        age,
        gender,
        phone,
        address,})
    return user
}

exports.loginUser = async ({email,password}) => {
    const user = await User.findOne({email})
    if(!user) throw new Error("Invalid credentials")
        const match = await bcrypt.compare(password, user.password)
    if(!match) throw new Error("Invalid credentials")

        const token = jwt.sign({id: user._id,role:user.role}, process.env.token, {
            expiresIn: "365d"
        })
        return {token,user}
}

