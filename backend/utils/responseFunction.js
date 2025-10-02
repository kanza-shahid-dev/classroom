export default function responseFunction(res, status, message, data, ok) {
  res.status(status).json({
    message,
    data,
    ok,
  });
}
