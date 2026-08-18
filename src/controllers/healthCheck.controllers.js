import { apiResponse } from '../utils/api-Response.js';
import { asyncHandlers } from '../utils/async-handlers.js';

/*
Another way to write healthCheck

const healthCheck = (req, res) => {
  try {
    res.status(200).json(new apiResponse(200, { message: 'Server is running' }));
  } catch (error) {}
};
*/
const healthCheck = asyncHandlers(async (req, res) => {
  res.status(200).json(new apiResponse(200, { message: 'Server is running' }));
});

export { healthCheck };
