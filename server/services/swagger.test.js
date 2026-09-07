const {
    TextEncoder,
    TextDecoder,
  } = require("util");
  
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  
  const request = require("supertest");
  
  const app = require("../app");
  const swaggerSpec = require("../swagger");
  
  describe("Swagger API documentation", () => {
    test("Swagger documentation is available", async () => {
      const response = await request(app)
        .get("/api-docs/")
        .expect(200);
  
      expect(response.text).toContain(
        "Swagger UI"
      );
    });
  
    test("Swagger specification contains task endpoints", () => {
      expect(swaggerSpec.paths).toHaveProperty(
        "/tasks"
      );
  
      expect(swaggerSpec.paths).toHaveProperty(
        "/tasks/{id}"
      );
  
      expect(
        swaggerSpec.paths["/tasks"].get
      ).toBeDefined();
  
      expect(
        swaggerSpec.paths["/tasks"].post
      ).toBeDefined();
  
      expect(
        swaggerSpec.paths["/tasks/{id}"].put
      ).toBeDefined();
  
      expect(
        swaggerSpec.paths["/tasks/{id}"].patch
      ).toBeDefined();
  
      expect(
        swaggerSpec.paths["/tasks/{id}"].delete
      ).toBeDefined();
    });
  });