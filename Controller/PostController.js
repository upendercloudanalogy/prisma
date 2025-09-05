import prisma from "../DB/db.config.js";

export const fetchPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                comment: true
            },
            orderBy: {
                createdAt: 'desc'
        }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// gt  - greater than
// gte - greater than equal to
// lt  - less than

// or - []
// [{},{}] 

//and - [ {} , {}]



export const createPost = async (req, res) => {
    const { title, user_id, content } = req.body;
    if (!title || !user_id) {
        return res.status(400).json({ error: "Title and User ID are required" });
    }
    try {
        const newPost = await prisma.post.create({
            data: {
                title,
                user_id: Number(user_id),
                content,
            },
        });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const showPost = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Post ID is required" });
    }
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) },
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Post ID is required" });
    }
    try {
        const deletedPost = await prisma.post.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json(deletedPost);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

