import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

// import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import { TodoAccess } from '../businessLogic/todoAccess'

const todoAccess = new TodoAccess();

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here

    const userId = getUserId(event);
    console.log("GET TODOS  USERID ", userId)
    const todos = await todoAccess.getTodos(userId);


    // Send results
    return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers' : 'Content-Type',
          'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
          items: todos
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
