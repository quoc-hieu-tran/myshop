const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  let message = err.message;
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource Not Found. Use MongoDB real _id)";
    res.status(404);
  }
  res.json({ message, stack: process.env.NODE_ENV === "production" ? null : err.stack });
};

export { notFound, errorHandler };
