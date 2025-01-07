import supertest from "supertest";
import chai from "chai";
import config from "../src/config/config.js";
import path from "path";

const PORT = config.app.PORT || 8080;
const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing de Carga de Imágenes", () => {
    it("Creamos mascota con imagen", async () => {

        const mascotaMockeada = {
            name: "Chester",
            specie: "Perro",
            birthDate: "2024-12-01",
        };

        const imagenPath = path.join(__dirname, "../test/perritoTierno.jpg");

        const resultado = await requester
            .post("/api/pets/withimage")
            .field("name", mascotaMockeada.name)
            .field("specie", mascotaMockeada.specie)
            .field("birthDate", mascotaMockeada.birthDate)
            .attach("image", imagenPath)
            .timeout(5000);

        expect(resultado.status).to.equal(200);
        expect(resultado._body.payload).to.have.property("_id");
        expect(resultado._body.payload.image).to.be.ok;
    });

    it("Debe rechazar la carga si no se envía una imagen", async () => {
        const mascotaSinImagen = {
            name: "Milo",
            specie: "Gato",
            birthDate: "2024-07-10",
        };

        const resultado = await requester
            .post("/api/pets/withimage")
            .field("name", mascotaSinImagen.name)
            .field("specie", mascotaSinImagen.specie)
            .field("birthDate", mascotaSinImagen.birthDate)
            .timeout(5000);

        expect(resultado.status).to.equal(400);
        expect(resultado._body.message).to.include("Imagen requerida");
    });

    it("Debe rechazar la carga si el archivo no es una imagen válida", async () => {
        // Cargar un archivo inválido
        const archivoNoValido = path.join(__dirname, "../test/archivoNoImagen.txt");

        const resultado = await requester
            .post("/api/pets/withimage")
            .field("name", "Puppy")
            .field("specie", "Perro")
            .field("birthDate", "2024-05-22")
            .attach("image", archivoNoValido)
            .timeout(5000);

        // Verificar que la respuesta sea un error por tipo de archivo inválido
        expect(resultado.status).to.equal(400);
        expect(resultado._body.message).to.include("El archivo debe ser una imagen válida");
    });
});