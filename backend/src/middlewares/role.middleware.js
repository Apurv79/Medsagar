const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    const role = req.user?.role;

    // SUPER_ADMIN is always allowed
    if (role === "SUPER_ADMIN" || roles.includes(role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  };
};

export default roleMiddleware;