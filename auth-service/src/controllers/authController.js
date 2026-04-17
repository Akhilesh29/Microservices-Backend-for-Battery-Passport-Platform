const {
  registerUser,
  loginUser,
  verifyToken,
} = require("../services/authService");

async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

function verify(req, res, next) {
  try {
    const payload = verifyToken(req.headers.authorization);
    res.status(200).json({
      message: "Token is valid",
      user: {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  verify,
};

