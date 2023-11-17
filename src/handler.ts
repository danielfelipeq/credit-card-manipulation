import { DynamoDB } from "aws-sdk";
import { CardValidator } from "./utils/card-validator";
import { TokenGenerator } from "./utils/token-generator";

class Handler {
    constructor(private db: DynamoDB, private cardValidator: CardValidator, private tokenGenerator: TokenGenerator) {}

    async handle(event: APIGatewayProxyEvent) {
        const token = event.headers["x-token"];
        const cardData = event.body;

        if (!token) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    error: "No token provided",
                }),
            };
        }

        const comercioId = event.pathParameters["comercioId"];

        if (!this.cardValidator.isValid(cardData.cardNumber, cardData.cvv, cardData.expirationMonth, cardData.expirationYear)) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    error: "Invalid card data",
                }),
            };
        }

        try {
            const tokenData = {
                token,
                cardData,
                comercioId,
                createdAt: new Date(),
            };

            this.db.putItem({
                TableName: "tokens",
                Item: tokenData,
            });

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    error: error.message,
                }),
            };
        }
    }
}
