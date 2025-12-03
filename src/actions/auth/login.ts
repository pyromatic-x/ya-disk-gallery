"use server";

import { database } from "@database";
import { TUser, User } from "@schemas";
import { cookies } from "next/headers";

export const action_login = async (payload: TUser) => {
  const error = {
    success: false,
    message: "Your account is not in whitelist yet, wait for approval.",
  };

  try {
    await database.connect();
    const user = await User.findOne({ id: payload.id }).lean();

    if (user?.approved) {
      const store = await cookies();
      store.set("uid", String(user.id), {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return true;
    }

    if (!user) {
      User.insertOne(payload);
    }

    throw error;
  } catch (error) {
    throw error as Error;
  }
};
