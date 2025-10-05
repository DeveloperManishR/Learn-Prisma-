import prisma from "../db/db.config.js";

export const createPost = async (req, res) => {
  try {
    console.log("reg", req.body);
    const { userId, title, description } = req.body;

    const newPost = await prisma.post.create({
      data: {
        userId,
        title,
        description,
      },
    });

    return res.json({
      status: 200,
      data: newPost,
      msg: "Post created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const showPost = async (req, res) => {
  const postId = req.params.id;
  const post = await prisma.post.findFirst({
    where: {
      id: Number(postId),
    },
  });

  return res.json({ status: 200, data: post });
};

export const updatePost = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  try {
    await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        name,
        email,
        password,
      },
    });

    return res.json({ status: 200, message: "User updated successfully" });
  } catch (error) {
    console.log("err", error);
  }
};

export const fetchPosts = async (req, res) => {
  try {
    const allPosts = await prisma.post.findMany({
      // include:{ // Only Fetch Comment 
      //   comment:true
      // }

      include :{
        comment:{
          include:{
           // user :true // fetch whole data
            user:{
              select:{
                name:true
              }
            }
            }
        }
      }
    });
    return res.json({ status: 200, data: allPosts });
  } catch (error) {}
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  await prisma.post.delete({
    where: {
      id: Number(postId),
    },
  });

  return res.json({ status: 200, msg: "Post deleted successfully" });
};
