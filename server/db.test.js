const {
    TextEncoder,
    TextDecoder,
  } = require("util");
  
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  
  require("dotenv").config();
  
  const pool = require("./db");
  
  describe("PostgreSQL connection", () => {
    afterAll(async () => {
      await pool.end();
    });
  
    test("connects successfully to PostgreSQL", async () => {
      const result = await pool.query(
        "SELECT current_database() AS database"
      );
  
      expect(
        result.rows[0].database
      ).toBe("taskflow");
    });
  });