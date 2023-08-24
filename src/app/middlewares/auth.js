import jwt from "jsonwebtoken"
import authConfig from "../../config/auth.json" assert { type: "json" };

export default (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        console.log("oi")
        return res.status(401).send({error: "No token provided"});
    }
    const parts = authHeader.split(" ");

    if(!(parts.length === 2)){
        console.log("oi")
        return res.status(401).send({error: "Token error"});
    }

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)){
        console.log("oi")
        return res.status(401).send({error: "Token malformatted"});
    }
    
    // jwt.verify(token, authConfig.secret, (err, decoded) => {
    //     if(err){
    //         console.log("oi")
    //         return res.status(401).send({error: "Token invalid"});
    //     }

    //     req.userId = decoded.id 

    //     console.log("oi1")
    //     return next()
    // })
 
    try {

        const decoded = jwt.verify(token, authConfig.secret);

        req.userId = decoded.id 
    
        req.teste = "teste"
    
        console.log("oi2")
    
        next()

    }catch (err) { 

        console.log(err)
        console.log("oi")
        return res.status(401).send({error: "Token invalid"});

    }
}