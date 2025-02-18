import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // TODO: verify the token exists and add the user data to the request object

    // Get the authorization header from the request
    const authHeader = req.headers.authorization;
  
    // Check if the authorization header is present
    if (authHeader) {
      // Extract the token from the authorization header
      const token = authHeader.split(' ')[1];
  
      // Get the secret key from the environment variables
      const secretKey = process.env.JWT_SECRET_KEY || '';
  
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Send forbidden status if the token is invalid
    }

    // Attach the user information to the request object
    req.user = user as JwtPayload;
    return next(); // Call the next middleware function
  });
} else {
  res.sendStatus(401); // Send unauthorized status if no authorization header is present
}
};