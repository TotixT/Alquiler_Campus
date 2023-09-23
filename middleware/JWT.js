import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ mensaje: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Almacena los datos del usuario en el objeto req.user
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido" });
    }
}

export default authMiddleware;