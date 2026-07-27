import { auth } from "../lib/auth.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(req.headers),
    });

    if (!session) {
      return res.status(401).send({ message: "unauthorized access" });
    }

    req.user = session.user;
    next();
  } catch (error) {
    return res.status(401).send({ message: "unauthorized access" });
  }
};