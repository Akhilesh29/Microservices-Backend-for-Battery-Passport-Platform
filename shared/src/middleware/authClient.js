const axios = require("axios");
const { AppError } = require("../utils/appError");

function resolveAuthServiceUrl(explicitUrl) {
  if (explicitUrl) {
    return explicitUrl;
  }

  const host = process.env.AUTH_SERVICE_HOST;
  const port = process.env.AUTH_SERVICE_PORT || "3001";

  if (!host) {
    throw new Error("AUTH_SERVICE_URL or AUTH_SERVICE_HOST is required");
  }

  return `http://${host}:${port}`;
}

function createAuthVerifier({ authServiceUrl, allowedRoles = [] }) {
  const resolvedAuthServiceUrl = resolveAuthServiceUrl(authServiceUrl);

  return async (req, _res, next) => {
    try {
      const authorization = req.headers.authorization;
      if (!authorization || !authorization.startsWith("Bearer ")) {
        return next(new AppError("Authorization token is required", 401));
      }

      const response = await axios.post(
        `${resolvedAuthServiceUrl}/api/auth/verify`,
        {},
        {
          headers: {
            Authorization: authorization,
          },
          timeout: 5000,
        }
      );

      req.user = response.data.user;

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return next(new AppError("Forbidden", 403));
      }

      next();
    } catch (error) {
      const status = error.response?.status || 401;
      const message = error.response?.data?.message || "Authentication failed";
      next(new AppError(message, status));
    }
  };
}

module.exports = {
  createAuthVerifier,
};
