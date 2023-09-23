import { Router } from "express";
import { getAllSuc_Aut, getSuc_AutById, createSuc_Aut, updateSuc_Aut, deleteSuc_Aut } from "../controller/suc_aut.controller.js"

const router = Router();

router.get("/All", getAllSuc_Aut);
router.get("/One/:id", getSuc_AutById);
router.post("/Create", createSuc_Aut);
router.put("/Update/:id", updateSuc_Aut);
router.delete("/Delete/:id", deleteSuc_Aut);

export default router;