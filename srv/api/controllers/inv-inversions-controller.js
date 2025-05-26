//1.-importacion de las librerias
const cds = require("@sap/cds");

//2.-importar el servicio
const { simulateSupertrend, reversionSimple, SimulateMomentum, SimulateMACrossover } = require("../services/inv-inversions-service");

//3.- estructura princiapl  de la clas de contorller

class inversionsClass extends cds.ApplicationService {
  //4.-iniciiarlizarlo de manera asincrona
  async init() {
    this.on("getall", async (req) => {
      return GetAllPricesHistory(req);
    });

    this.on("addone", async (req) => {
      return AddOnePricesHistory(req);
    });

    this.on("updateone", async (req) => {
      return UpdateOnePricesHistory(req);
    });

    this.on("deleteone", async (req) => {
      return DeleteOnePricesHistory(req);
    });

    this.on("simulation", async (req) => {
      try {
        const { strategy } = req?.req?.query || {};
        const body = req?.req?.body?.SIMULATION || {}; 
        console.log(body);

        if (!strategy) {
          throw new Error(
            "Falta el parámetro requerido: 'strategy' en los query parameters."
          );
        }
        if (Object.keys(body).length === 0) {
          throw new Error(
            "El cuerpo de la solicitud no puede estar vacío. Se esperan parámetros de simulación."
          );
        }
        switch (strategy.toLowerCase()) {
            case "reversionsimple":
              return await reversionSimple(body);

            case "supertrend":
              return await simulateSupertrend(body);

            case "momentum":
              return await SimulateMomentum(body);

            case "macrossover":
              return await SimulateMACrossover(body);
          default:
            throw new Error(`Estrategia no reconocida: ${strategy}`);
        }
      } catch (error) {
        console.error("Error en el controlador de simulación:", error);
        return {
          ERROR: true,
          MESSAGE:
            error.message || "Error al procesar la solicitud de simulación.",
        };
      }
    });
    return await super.init();
  }
}

module.exports = inversionsClass;
