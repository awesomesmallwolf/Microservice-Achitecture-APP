import { ValidationError } from "express-validator";
import CustomError from "./custom-error";

class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]){
    // Logging purposes
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(){
    return this.errors.map(err => {
      return { message: err.msg, field: err.param};
    })
  }
}

export default RequestValidationError;