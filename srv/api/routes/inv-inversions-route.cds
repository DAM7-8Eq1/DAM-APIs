//1.-importar el modelo de datos de pricehistory desestructurandolos 
using {inv as myinv} from '../models/inv-inversions';


//2.-posteriori  imoekemntamos la ruta de nuestro contolador
//implementacion del controlador logico
@impl: 'srv/api/controllers/inv-inversions-controller.js'

//3.-creacion de la estructura base 


service InversionsRoute @(path:'/api/inv'){


    entity entsimulation as projection on myinv.SIMULATION;
    entity priceshistory as projection on myinv.priceshistory;
    entity strategies as projection on myinv.strategies;


    @Core.Description: 'get-all-prices-history'
    @path :'getall'
    function getall()
    returns array of priceshistory;


    @Core.Description: 'add-one-prices-history'
    @path :'addone'
    function addone(prices : priceshistory)
    returns array of priceshistory;

    @Core.Description: 'update-one-prices-history'
    @path :'updateone'
    function updateone(prices : priceshistory)
    returns array of priceshistory;

    @Core.Description: 'delete-one-prices-history'
    @path :'deleteone'
    function deleteone(prices : priceshistory)
    returns array of priceshistory;

    @path: 'simulation'
    action simulation(SIMULATION : entsimulation) returns array of entsimulation;

    @path: 'history'
    function history() returns array of entsimulation;

    @path: 'updatesimulation'
    action updatesimulation(SIMULATION : entsimulation) returns array of entsimulation;

    @path: 'deletesimulation'
    action deletesimulation(SIMULATIONIDS: Array of String) returns array of entsimulation;
};




