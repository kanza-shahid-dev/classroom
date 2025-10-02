import jwt from "jsonwebtoken";

function checkAuth(req, res, next) {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;

  if (!authToken || !refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    //check if auth token is expired
    if (err) {
      //if expired check if refresh token is valid ( to send auth token call again )
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY,
        (refreshErr, refreshDecoded) => {
          if (refreshErr) {
            return res.status(401).json({ message: "Unauthorized" });
          } else {
            //get new auth token
            const newAuthToken = jwt.sign(
              { userId: refreshDecoded.userId },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "1d" }
            );
            const newRefreshToken = jwt.sign(
              { userId: refreshDecoded.userId },
              process.env.JWT_REFRESH_SECRET_KEY,
              { expiresIn: "10d" }
            );
            res.cookie("authToken", newAuthToken, {
              sameSite: "none",
              httpOnly: true,
              secure: true,
            });

            res.cookie("refreshToken", newRefreshToken, {
              sameSite: "none",
              httpOnly: true,
              secure: true,
            });

            req.userId = refreshDecoded.userId;
            req.ok = true;
            req.message = "Authentication successful";
            next();
          }
        }
      );
    } else {
      req.userId = decoded.userId;
      req.ok = true;
      req.message = "Authentication successful";
      next();
    }
  });
}

router.get("/checklogin", authTokenHandler, async (req, res, next) => {
  console.log("check login", req.message);
  res.json({
    ok: req.ok,
    message: req.message,
    userId: req.userId,
  });
});

router.get("/getuser", authTokenHandler, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return responseFunction(res, 400, "User not found", null, false);
    }
    return responseFunction(res, 200, "User found", user, true);
  } catch (err) {
    return responseFunction(res, 500, "Internal server error", err, false);
  }
});

router.get("/logout", authTokenHandler, async (req, res, next) => {
  res.clearCookie("authToken");
  res.clearCookie("refreshToken");

  res.json({
    ok: true,
    message: "Logged out successfully",
  });
});

export const authTokenHandler = checkAuth;
