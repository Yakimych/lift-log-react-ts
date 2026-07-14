const emptyResponse = {
  description: "Empty response",
};

const rateLimitedResponse = {
  description: "Rate limit exceeded",
};

const internalErrorResponse = {
  description: "Internal server error",
  content: {
    "application/problem+json": {
      schema: { $ref: "#/components/schemas/ProblemDetails" },
    },
  },
};

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Lift Log API",
    version: "1.0.0",
    description:
      "Contract-compatible replacement for the original Lift Log Web API. Routes and log-name lookups are case-insensitive.",
  },
  servers: [{ url: "/" }],
  paths: {
    "/api/LiftLogs": {
      get: {
        operationId: "getLiftLogs",
        summary: "Get all lift logs",
        tags: ["LiftLogs"],
        responses: {
          "200": {
            description: "All lift logs in stable ordinal order",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/LiftLog" },
                },
              },
            },
          },
          "429": rateLimitedResponse,
          "500": internalErrorResponse,
        },
      },
      post: {
        operationId: "createLiftLog",
        summary: "Create a lift log",
        tags: ["LiftLogs"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateLiftLog" },
            },
          },
        },
        responses: {
          "201": emptyResponse,
          "400": {
            description: "Invalid input or duplicate lowercase log name",
          },
          "429": rateLimitedResponse,
          "500": internalErrorResponse,
        },
      },
    },
    "/api/LiftLogs/{logName}": {
      parameters: [
        {
          in: "path",
          name: "logName",
          required: true,
          schema: { type: "string" },
        },
      ],
      get: {
        operationId: "getLiftLog",
        summary: "Get one lift log",
        tags: ["LiftLogs"],
        responses: {
          "200": {
            description: "The requested lift log",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LiftLog" },
              },
            },
          },
          "404": emptyResponse,
          "429": rateLimitedResponse,
          "500": internalErrorResponse,
        },
      },
    },
    "/api/LiftLogs/{logName}/Lifts": {
      parameters: [
        {
          in: "path",
          name: "logName",
          required: true,
          schema: { type: "string" },
        },
      ],
      post: {
        operationId: "addLiftLogEntry",
        summary: "Add one entry document to a lift log",
        tags: ["LiftLogs"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LiftLogEntry" },
            },
          },
        },
        responses: {
          "201": emptyResponse,
          "400": { description: "Invalid input" },
          "404": emptyResponse,
          "429": rateLimitedResponse,
          "500": internalErrorResponse,
        },
      },
    },
    "/api/HealthCheck": {
      get: {
        operationId: "healthCheck",
        summary: "Check MongoDB connectivity",
        tags: ["Health"],
        responses: {
          "200": emptyResponse,
          "429": rateLimitedResponse,
          "503": { description: "MongoDB is unavailable" },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateLiftLog: {
        type: "object",
        additionalProperties: true,
        required: ["title", "name"],
        properties: {
          title: { type: "string", maxLength: 50 },
          name: { type: "string", minLength: 2, maxLength: 20 },
        },
      },
      LiftLog: {
        type: "object",
        required: ["name", "title", "entries"],
        properties: {
          name: { type: "string" },
          title: { type: "string" },
          entries: {
            type: "array",
            items: { $ref: "#/components/schemas/LiftLogEntry" },
          },
        },
      },
      LiftLogEntry: {
        type: "object",
        additionalProperties: true,
        required: ["name", "weightLifted", "date", "sets"],
        properties: {
          name: { type: "string", maxLength: 30 },
          weightLifted: {
            type: "number",
            minimum: 0,
            maximum: 999,
          },
          date: { type: "string", format: "date-time" },
          sets: {
            type: "array",
            items: { $ref: "#/components/schemas/Set" },
          },
          comment: {
            type: "string",
            maxLength: 400,
            nullable: true,
          },
          links: {
            type: "array",
            maxItems: 3,
            nullable: true,
            items: { $ref: "#/components/schemas/Link" },
          },
        },
      },
      Set: {
        type: "object",
        required: ["numberOfReps", "rpe"],
        properties: {
          numberOfReps: {
            type: "integer",
            minimum: 1,
            maximum: 999,
          },
          rpe: {
            type: "number",
            nullable: true,
            enum: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
          },
        },
      },
      Link: {
        type: "object",
        required: ["text", "url"],
        properties: {
          text: { type: "string", maxLength: 20 },
          url: { type: "string", maxLength: 200 },
        },
      },
      ProblemDetails: {
        type: "object",
        required: ["title", "status"],
        properties: {
          title: { type: "string" },
          status: { type: "integer" },
          errors: {
            type: "array",
            items: {
              type: "object",
              required: ["path", "message"],
              properties: {
                path: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
} as const;

export const swaggerHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lift Log API</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.addEventListener("load", function () {
        SwaggerUIBundle({
          url: "/swagger/v1/swagger.json",
          dom_id: "#swagger-ui",
          deepLinking: true
        });
      });
    </script>
  </body>
</html>`;
