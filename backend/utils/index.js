import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

export const hashString = async (useValue) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(useValue, salt);
    return hashPassword
}

export const compareString = async (userPassword, password) => {
    console.log(userPassword, "yyy", password);
    const isMatch = await bcrypt.compare(userPassword, password);
    return isMatch
}

export function createJWT(id) {
    return Jwt.sign({ usrId: id }, process.env.JWT_SECRET_KEYS, {
        expiresIn: "1d",
    })
}