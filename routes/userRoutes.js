import { Router } from "express";
import { createUser,updateUser,deleteUser,showUser,listUsers} from "../Controller/UserController.js";

const router = Router();

router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', showUser);
router.get('/', listUsers);

export default router;