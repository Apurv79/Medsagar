const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();
  };
};

export default roleMiddleware;