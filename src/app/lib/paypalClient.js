import {
  ApiError,
  Client,
  Environment,
  LogLevel,
  OrdersController
} from '@paypal/paypal-server-sdk';

let cachedControllers = null;

function getControllers() {
  if (cachedControllers) return cachedControllers;

  const { NEXT_PUBLIC_PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

  if (!NEXT_PUBLIC_PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET environment variables');
  }

  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      oAuthClientSecret: PAYPAL_CLIENT_SECRET
    },
    timeout: 0,
    environment: Environment.Sandbox,
    logging: {
      logLevel: LogLevel.Info,
      logRequest: { logBody: true },
      logResponse: { logHeaders: true }
    }
  });

  cachedControllers = {
    ordersController: new OrdersController(client)
  };
  return cachedControllers;
}

export const createOrder = async() => {
  const { ordersController } = getControllers();
  const collect = {
    body: {
      intent: 'CAPTURE',
      purchaseUnits: [
        {
          amount: {
            currencyCode: 'USD',
            value: '100',
            breakdown: {
              itemTotal: { currencyCode: 'USD', value: '100' }
            }
          },
          items: [
            {
              name: 'T-Shirt',
              unitAmount: { currencyCode: 'USD', value: '100' },
              quantity: '1',
              description: 'Super Fresh Shirt',
              sku: 'sku01'
            }
          ]
        }
      ]
    },
    prefer: 'return=minimal'
  };

  try {
    const { body, ...httpResponse } = await ordersController.createOrder(collect);
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const captureOrder = async(orderID) => {
  const { ordersController } = getControllers();
  const collect = { id: orderID, prefer: 'return=minimal' };

  try {
    const { body, ...httpResponse } = await ordersController.captureOrder(collect);
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw error;
  }
};
