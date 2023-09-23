import { Router } from "express";
import { getAllAlquiler, getAlquilerById, createAlquiler, updateAlquiler, deleteAlquiler } from "../controller/alquiler.controller.js"

const router = Router();

router.get("/All", getAllAlquiler);
router.get("/One/:id", getAlquilerById);
router.post("/Create", createAlquiler);
router.put("/Update/:id", updateAlquiler);
router.delete("/Delete/:id", deleteAlquiler);

export default router;