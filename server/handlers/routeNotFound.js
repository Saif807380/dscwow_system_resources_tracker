const routeNotFound = (req, res, next) => {
  return res.status(404).json({
    error: "404",
    message: "Route not found",
  });
};

export default routeNotFound;
