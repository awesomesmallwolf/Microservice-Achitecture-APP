import CustomError from "./custom-error";

class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to database';

  constructor(){
    // Logging purposes
    super('Error connecting to db');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(){
    return [
      {
        message: this.reason
      }
    ];
  }
}

export default DatabaseConnectionError;
