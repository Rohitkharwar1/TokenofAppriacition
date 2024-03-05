const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    status: statusCode,
    message: err.message,
    url: req.url,
    meta: res.meta || null,
    data: null,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
