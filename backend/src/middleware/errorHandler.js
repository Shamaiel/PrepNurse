function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
}

module.exports = errorHandler;
