import { Router } from "express";
import { getAllReserva, getReservaById, createReserva, updateReserva, deleteReserva } from "../controller/reserva.controller.js"

const router = Router();

router.get("/All", getAllReserva);
router.get("/One/:id", getReservaById);
router.post("/Create", createReserva);
router.put("/Update/:id", updateReserva);
router.delete("/Delete/:id", deleteReserva);

export default router;