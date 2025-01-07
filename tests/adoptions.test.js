import supertest from "supertest";
import chai from "chai";
import config from "../src/config/config.js";

const PORT = config.app.PORT || 8080;
const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing de Adopciones", () => {
    it("Cuando se registra una adopción", async () => {
        const mockMascota = {
            name: "Lali",
            specie: "Perrito",
            birthDate: "1991-10-10",
        };

        const petResponse = await requester.post("/api/pets").send(mockMascota);
        const petId = petResponse._body.payload?._id;
        expect(petId).to.not.be.undefined;

        const mockUsuario = {
            first_name: "Gabriel",
            last_name: "Gomez",
            email: "gabrielgomez@gmail.com",
            password: "1234",
        };

        const userResponse = await requester.post("/api/sessions/register").send(mockUsuario);
        const userId = userResponse._body.payload;
        expect(userId).to.not.be.undefined;

        const mockAdopcion = {
            uid: userId,
            pid: petId,
            adoptionDate: "1977-10-12",
        };

        const response = await requester.post(`/api/adoptions/${userId}/${petId}`).send(mockAdopcion).timeout(10000);

        expect(response.status).to.equal(200);
        expect(response._body).to.have.property("status", "success");
        expect(response._body).to.have.property("message", "Pet adopted");
    });

    it("Al obtener adopciones con el método GET, la respuesta debe tener los campos status y payload", async () => {
        const { statusCode, _body } = await requester.get("/api/adoptions");
        expect(statusCode).to.equal(200);
        expect(_body).to.have.property("status").that.equals("success");
        expect(_body).to.have.property("payload").that.is.an("array");
    });
});