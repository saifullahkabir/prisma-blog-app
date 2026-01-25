import { prisma } from "../lib/prisma";
import { userRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    console.log("***** Admin Seeding Started....");
    const adminData = {
      name: "Admin 4",
      email: "admin4@admin.com",
      role: userRole.ADMIN,
      password: "admin1234",
    };
    console.log("**** Checking Admin Exist or not");
    // check user exists on db or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists!");
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:4000",
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      console.log("**** Admin Created");
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log("**** Email verification status updated!");
    }
    console.log("****** Success ******");
  } catch (err) {
    console.error(err);
  }
}

seedAdmin();
