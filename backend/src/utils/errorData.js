export const  DateValidationError = {
    status: 'error',
    errorCode: 403,
    message: 'From-Date must be greater than To-Date',
  };

  export const  noDataError ={
    message: 'No data is found for the given period',
    errno: 404,
  };

  export const  noEnoughDataError ={
    message: 'enough data is not found for the given stock',
    errno: 404,
  };