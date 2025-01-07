import supertest from "supertest";
import chai from "chai";
import config from "../src/config/config.js";

const PORT = config.app.PORT || 8080;
const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing de Usuarios", () => {
    let cookie;

    it("Cuando se registra correctamente un usuario", async () => {
        const mockUsuario = {
            first_name: "Daniel",
            last_name: "Lopez",
            email: "daniellopez@gmail.com",
            password: "1234",
        };
        const { _body } = await requester.post("/api/sessions/register").send(mockUsuario);
        expect(_body.payload).to.be.ok;
    });

    it("Cuando se logea correctamente el usuario", async () => {
        const mockUsuario = {
            email: "daniellopez@gmail.com",
            password: "1234",
        };
        const resultado = await requester.post("/api/sessions/login").send(mockUsuario);
        const cookieResultado = resultado.headers["set-cookie"][0];
        expect(cookieResultado).to.be.ok;
        cookie = {
            name: cookieResultado.split("=")[0],
            value: cookieResultado.split("=")[1].split(";")[0],
        };
        expect(cookie.name).to.be.ok.and.equal("coderCookie");
        expect(cookie.value).to.be.ok;
    });

    it("Cuando se envía la cookie que contiene el usuario registrado", async () => {
        const { statusCode, _body } = await requester
            .get("/api/sessions/current")
            .set("Cookie", `${cookie.name}=${cookie.value}`)
            .timeout(5000);
        expect(statusCode).to.equal(200);
        expect(_body.payload.email).to.be.equal("daniellopez@gmail.com");
    });
});