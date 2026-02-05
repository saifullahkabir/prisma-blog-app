import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;

  //* PrismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Invalid data format or missing required fields";
  }
  //* PrismaClientKnownRequestError
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "Requested resource not found";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed";
    }
  }
  //* PrismaClientUnknownRequestError
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Unexpected database error occurred";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage = "Internal server error. Please try again later.";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    errorMessage = "Service temporarily unavailable. Please try again later.";
  }

  res.status(statusCode);
  res.json({
    success: false,
    message: errorMessage,
  });
}

export default errorHandler;
