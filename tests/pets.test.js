import supertest from "supertest";
import chai from "chai";
import config from "../src/config/config.js";

const PORT = config.app.PORT || 8080;
const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing de Mascotas", () => {
    it("Endpoint POST /api/pets debe crear una mascota correctamente", async () => {
        const lalaMock = {
            name: "Lala",
            specie: "Perrito Hembra",
            birthDate: "2020-03-11",
        };
        const { statusCode, _body } = await requester.post("/api/pets").send(lalaMock);
        expect(statusCode).to.equal(200);
        expect(_body.payload).to.have.property("_id");
    });

    it("Cuando se crea una mascota con los datos elementales, la mascota cuenta con la propiedad adopted:false", async () => {
        const nuevaMascota = {
            name: "Tichi",
            specie: "Perrito",
            birthDate: "2020-03-12",
        };
        const { statusCode, _body } = await requester.post("/api/pets").send(nuevaMascota);
        expect(statusCode).to.equal(200);
        expect(_body.payload).to.have.property("adopted").that.equals(false);
    });

    it("Cuando se crea una mascota sin el campo name, debe arrojar error 400", async () => {
        const mockSinNombre = {
            specie: "Gatito",
            birthDate: "2021-09-10",
        };
        const { statusCode } = await requester.post("/api/pets").send(mockSinNombre);
        expect(statusCode).to.equal(400);
    });

    it("Cuando se obtienen mascotas con el método GET, la respuesta debe tener los campos status y payload", async () => {
        const { statusCode, _body } = await requester.get("/api/pets");
        expect(statusCode).to.equal(200);
        expect(_body).to.have.property("status").that.equals("success");
        expect(_body).to.have.property("payload").that.is.an("array");
    });

    it("El método PUT actualiza correctamente una mascota determinada", async () => {
        const nuevaMascota = {
            name: "Boby",
            specie: "Perro",
            birthDate: "2018-05-15",
        };

        // Crear mascota para actualizar
        const { _body: nuevaMascotaCreada } = await requester.post("/api/pets").send(nuevaMascota);
        const idMascotaExistente = nuevaMascotaCreada.payload._id;

        // Datos a actualizar
        const datosActualizados = {
            name: "Dexter",
            specie: "Bull Dog",
        };

        // Realizar actualización
        const { statusCode, _body } = await requester.put(`/api/pets/${idMascotaExistente}`).send(datosActualizados);

        // Verificar resultados
        expect(statusCode).to.equal(200);
        expect(_body.payload).to.have.property("name", "Dexter");
        expect(_body.payload).to.have.property("specie", "Bull Dog");
    });

    it("El método DELETE debe poder borrar la última mascota agregada", async () => {
        // Agregar nueva mascota
        const nuevaMascotaParaBorrar = {
            name: "Michi",
            specie: "Gatito",
            birthDate: "2024-01-21",
        };
        const {
            _body: {
                payload: { _id },
            },
        } = await requester.post("/api/pets").send(nuevaMascotaParaBorrar);

        // Borrar la mascota agregada
        const { statusCode } = await requester.delete(`/api/pets/${_id}`);

        // Verificamos
        expect(statusCode).to.equal(200);
    });
});