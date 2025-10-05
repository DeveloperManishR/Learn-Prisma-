import prisma from "../db/db.config.js";

export const createUser = async (req, res) => {
  try {
    console.log("reg", req.body);
    const { name, email, password } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (findUser) {
      return res.json({ status: 400, message: "email already taken" });
    }

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    return res.json({
      status: 200,
      data: newUser,
      msg: "user created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = () => {
  try {
  } catch (error) {}
};

export const updateUser = async (req, res) => {
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

export const fetchUsers = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany({
      // userData with its post count

      // select:{
      //  _count:{
      //   select:{
      //     post:true
      //   }
      //  }
      // }

      include: {
        //  post:true //want all data from post field
        //comment:true, //want all data from cooment field
        post: {
          //want specific data
          select: {
            title: true,
            comment_count: true,
          },
        },
      },
    });
    return res.json({ status: 200, data: allUsers });
  } catch (error) {}
};
