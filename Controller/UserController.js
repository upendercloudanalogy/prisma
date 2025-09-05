import prisma from "../DB/db.config.js";

export const createUser = async (req, res) => {
    const { email, name, password } = req.body;
    if(!email) {
        return res.status(400).json({ error: "Email and Password are required" });
    }

    const findUser = await prisma.user.findUnique({
        where: { email }
    });

    try {
        if (findUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password,
            },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateUser = async (req, res) => 
    {
      const {name, email, password} = req.body;
      const {id} = req.params;
        if(!id) {
            return res.status(400).json({error: "User ID is required"});
        }
        try {
            const updatedUser = await prisma.user.update({
                where: {id: parseInt(id)},
                data: {name, email, password},
            });
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    export const deleteUser = async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        try {
            const deletedUser = await prisma.user.delete({
                where: { id: parseInt(id) },
            });
            res.status(200).json(deletedUser);
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    };

export const showUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const listUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { post: {
                select: {
                    title: true,
                    id: true
                }
            },
              _count: { select: { post: true } }
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

