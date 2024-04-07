import Jwt from "jsonwebtoken"


export const userAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split("")[1];

        const decodedTokens = await Jwt.verify(token, process.env.JWT_SECRET_KEYS);

        req.user = decodedTokens;
        next()
    } catch (error) {
        res.status(401).send({
            error: "Authentication error"
        })
    }
}
