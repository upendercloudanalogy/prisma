import prisma from "../DB/db.config.js";

export const fetchComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const createComment = async (req, res) => {
    const { comment, post_id, user_id } = req.body;
    if (!comment || !post_id || !user_id) {
        return res.status(400).json({ error: "Comment, Post ID and User ID are required" });
    }

    await prisma.post.update({
        where: { id: Number(post_id) },
        data: {
            comment_count: {
                increment: 1,
            },
        },
    });

    
    
    try {
        const newComment = await prisma.comment.create({
            data: {
                comment,
                post_id: Number(post_id),
                user_id: Number(user_id),
            },
        });
        res.status(201).json(newComment);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const showComment = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Comment ID is required" });
    }
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(id) },
        });
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteComment = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Comment ID is required" });
    }

    await prisma.post.update({
        where: { id: Number(id) },
        data: {
            comment_count: {
                decrement: 1,
            },
        },
    });
    
    try {
        const deletedComment = await prisma.comment.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json(deletedComment);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateComment = async (req, res) => {
    const { comment } = req.body;
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Comment ID is required" });
    }
    try {
        const updatedComment = await prisma.comment.update({
            where: { id: parseInt(id) },
            data: { comment },
        });
        res.status(200).json(updatedComment);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


