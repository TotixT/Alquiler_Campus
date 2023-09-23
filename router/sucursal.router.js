import { Router } from "express";
import { getAllSucursales, getSucursalById, createSucursal, updateSucursal, deleteSucursal } from "../controller/sucursal.controller.js"

const router = Router();

router.get("/All", getAllSucursales);
router.get("/One/:id", getSucursalById);
router.post("/Create", createSucursal);
router.put("/Update/:id", updateSucursal);
router.delete("/Delete/:id", deleteSucursal);

export default router;