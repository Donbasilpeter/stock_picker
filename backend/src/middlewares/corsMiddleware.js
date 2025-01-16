import cors from 'cors';

export const createCorsMiddleware = (allowedOrigin) => {
  return cors({
    origin: allowedOrigin, // Use the passed allowed origin
  });
};
