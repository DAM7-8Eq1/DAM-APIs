//1.-importar el modelo de datos de pricehistory desestructurandolos 
using {inv as myinv} from '../models/inv-inversions';


//2.-posteriori  imoekemntamos la ruta de nuestro contolador
//implementacion del controlador logico
@impl: 'srv/api/controllers/inv-inversions-controller.js'

//3.-creacion de la estructura base 


service InversionsRoute @(path:'/api/inv'){


    entity Simulation as projection on myinv.Simulation;
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
    @path :'delteone'
    function deleteone(prices : priceshistory)
    returns array of priceshistory;

    @Core.Description: 'Turtle-strategy'
    @path :'turtlesoup'
    action turtlesoup(
        symbol     : String,
        startDate  : DateTime,
        endDate    : DateTime,
        amount     : Decimal(18,8),
        userId     : String,
        specs      : String
    ) returns Simulation;
};




