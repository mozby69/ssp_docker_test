import type {
  NextFunction,
  Request,
  Response,
} from "express";

export function syncAuthenticate(req: Request,res: Response,next: NextFunction) {


  const expectedToken = process.env.SYNC_TOKEN;

  if (!expectedToken) {
    return res.status(500).json({
      success: false,
      message: "Sync authentication is not configured",
    });
  }

  const authorization =
    req.headers.authorization;

  if (
    !authorization?.startsWith(
      "Bearer "
    )
  ) {
    return res.status(401).json({
      success: false,
      message:
        "Missing sync token",
    });
  }

  const token =
    authorization.substring(7);

  if (token !== expectedToken) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid sync token",
    });
  }

  next();
}