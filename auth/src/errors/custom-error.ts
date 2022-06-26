abstract class CustomError extends Error {
  
  // subclass must implement this because of abstract keyword
  abstract statusCode: number;

  constructor(message: string){
    super(message);

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): {message: string; field?: string}[];

}

export default CustomError;