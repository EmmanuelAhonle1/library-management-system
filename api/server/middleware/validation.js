const allowedUserTypes = ["client", "librarian"];

export const validateUserType = (req, res, next) => {
  const { userType } = req.params;

  if (!allowedUserTypes.includes(userType)) {
    return res.status(400).json({
      error: `User type '${userType}' is not allowed.`,
    });
  }

  next();
};

export const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    next();
  };
};
