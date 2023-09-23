import { Router } from "express";
import authMiddleware from "../middleware/JWT.js";
import { check } from "express-validator";
import { EndPoint2, 
    EndPoint3, 
    EndPoint4, 
    EndPoint5, 
    EndPoint6, 
    EndPoint7,
    EndPoint8, 
    EndPoint9, 
    EndPoint10, 
    EndPoint11, 
    EndPoint12, 
    EndPoint13, 
    EndPoint14,
    EndPoint15, 
    EndPoint16, 
    EndPoint17, 
    EndPoint18, 
    EndPoint19, 
    EndPoint20, 
    EndPoint21 
} from "../controller/endpoints.controller.js"
import validateDocuments  from "../middleware/validate.documents.js";

const router = Router();

router.get("/EndPoint2", [authMiddleware], EndPoint2);
router.get("/EndPoint3", [authMiddleware], EndPoint3);
router.get("/EndPoint4", [authMiddleware], EndPoint4);
router.get("/EndPoint5", [authMiddleware], EndPoint5);
router.get("/EndPoint6/:idAlquiler", [authMiddleware], EndPoint6);
router.get("/EndPoint7", [authMiddleware], EndPoint7);
router.get("/EndPoint8", [authMiddleware], EndPoint8);
router.get("/EndPoint9/:idAlquiler", [authMiddleware], EndPoint9); 
router.get("/EndPoint10/:dni", [authMiddleware], EndPoint10);
router.get("/EndPoint11", [authMiddleware], EndPoint11);
router.get("/EndPoint12", [authMiddleware], EndPoint12);
router.get("/EndPoint13/:clienteId", [authMiddleware], EndPoint13);
router.get("/EndPoint14", [authMiddleware], EndPoint14);
router.get("/EndPoint15", [authMiddleware], EndPoint15);
router.get("/EndPoint16", [authMiddleware], EndPoint16);
router.get("/EndPoint17", [authMiddleware], EndPoint17);
router.get("/EndPoint18", [authMiddleware], EndPoint18);
router.get("/EndPoint19", [authMiddleware], EndPoint19);
router.post("/EndPoint20", [
    check('cli_dni','El Dni del Cliente no es valido').not().isEmpty(),
    validateDocuments
], EndPoint20);
router.get("/EndPoint21", [authMiddleware], EndPoint21);

export default router;