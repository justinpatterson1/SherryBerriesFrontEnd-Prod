// lib/paypalClient.ts
import {
    ApiError,
    Client,
    Environment,
    LogLevel,
    OrdersController,
    PaymentsController,
  } from "@paypal/paypal-server-sdk";
  
  const {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET,
  } = process.env;

  if (!NEXT_PUBLIC_PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error(
      "Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET environment variables"
    );
  }

  // Create a single shared PayPal client instance
  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: Environment.Sandbox, // Change to Environment.Live in production
    logging: {
      logLevel: LogLevel.Info,
      logRequest: { logBody: true },
      logResponse: { logHeaders: true },
    },
  });
  
  const ordersController = new OrdersController(client);
  const paymentsController = new PaymentsController(client);
  
  // Create an order to start the transaction
  export const createOrder = async (cart) => {
    // Here you would normally calculate amounts from `cart`
    const collect = {
      body: {
        intent: "CAPTURE",
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: "100",
              breakdown: {
                itemTotal: {
                  currencyCode: "USD",
                  value: "100",
                },
              },
            },
            // Lookup item details in `cart` from your database
            items: [
              {
                name: "T-Shirt",
                unitAmount: {
                  currencyCode: "USD",
                  value: "100",
                },
                quantity: "1",
                description: "Super Fresh Shirt",
                sku: "sku01",
              },
            ],
          },
        ],
      },
      prefer: "return=minimal",
    };
  
    try {
      const { body, ...httpResponse } = await ordersController.createOrder(
        collect
      );
  
      return {
        jsonResponse: JSON.parse(body),
        httpStatusCode: httpResponse.statusCode,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  };
  
  // Capture an order to complete the transaction
  export const captureOrder = async (orderID) => {
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };
  
    try {
      const { body, ...httpResponse } = await ordersController.captureOrder(
        collect
      );
  
      return {
        jsonResponse: JSON.parse(body),
        httpStatusCode: httpResponse.statusCode,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error;
    }
  };
  