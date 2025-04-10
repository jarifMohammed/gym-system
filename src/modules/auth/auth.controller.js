const authService = require("./auth.service");

exports.register = async (req,res)=>{
   try{
    const user = await authService.registerUser(req.body)
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        data:user
    })
   }catch(err){
    res.status(400).json({
        success:false,
        message:err.message
    })
   }


}

exports.login = async (req,res)=>{
    try{
        const {token,user} = await authService.loginUser(req.body)
        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            data:{user,token}
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}