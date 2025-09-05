import { Router } from "express";
import { createComment, deleteComment, fetchComments, showComment,updateComment } from "../Controller/CommentController.js";
const router = Router();
router.post('/', createComment);
router.get('/', fetchComments);
router.get('/:id', showComment);
router.delete('/:id', deleteComment);
router.put('/:id', updateComment);
export default router;