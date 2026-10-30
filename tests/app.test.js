import request from "supertest";
import app from "../src/app.js";

describe("API", () => {
  it("health ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("create todo", async () => {
    const created = await request(app).post("/todos").send({ title: "Read" });
    expect(created.status).toBe(201);
  });
});
