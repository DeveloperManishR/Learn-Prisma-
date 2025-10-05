import prisma from "../db/db.config.js";

export const createComment = async (req, res) => {
  try {
    console.log("reg", req.body);
    const { userId, comment, postId } = req.body;

    // Increase the Comment Counter

    const updateCommentCount = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        comment_count: {
          increment: 1,
        },
      },
    });

    const newComent = await prisma.comment.create({
      data: {
        userId: Number(userId),
        postId: Number(postId),
        comment,
      },
    });

    return res.json({
      status: 200,
      data: newComent,
      msg: "Comment created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const showComment = async (req, res) => {
  const CommentId = req.params.id;
  const Comment = await prisma.comment.findFirst({
    where: {
      id: Number(CommentId),
    },
  });

  return res.json({ status: 200, data: Comment });
};

export const updateComment = async (req, res) => {
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

export const fetchComments = async (req, res) => {
  try {
    const allComments = await prisma.comment.findMany({
      include:{
       // post:true // want all data from post field

       user:true,
       
       post:{
        include:{
          user:{
            select:{
              name:true,
              email:true

            }
          }
        }
       }  
      
      }
    });
    return res.json({ status: 200, data: allComments });
  } catch (error) {}
};

export const deleteComment = async (req, res) => {
  const CommentId = req.params.id;

  await prisma.comment.delete({
    where: {
      id: Number(CommentId),
    },
  });

  return res.json({ status: 200, msg: "Comment deleted successfully" });
};
