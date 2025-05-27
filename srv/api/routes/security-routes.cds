using { security as s } from '../models/security';

@impl: 'srv/api/controllers/security-controller.js'
service SecurityRoute @(path:'/api/security') {

  // ─── CATÁLOGOS ─────────────────────────────────────────
  entity Catalog as projection on s.Catalog;
  entity Value as projection on s.Value;
  entity CatalogWithValues as projection on s.CatalogWithValues;

  @Core.Description: 'Obtener catálogos. Filtra por labelid y valueid si se proporcionan (en el body de la petición)'
  @path: 'catalogs'
  function catalogs(labelid: String, valueid: String) returns array of CatalogWithValues;
  
  @Core.Description: 'Obtener todos los catálogos'
  @path: 'allCatalogs'
  function allCatalogs() returns array of CatalogWithValues;

  @Core.Description: 'Obtener catálogos de departametno por compañia'
  @path: 'catalogsCompanie'
  function catalogsCompanie(labelid: String) returns array of CatalogWithValues;
  
  @Core.Description: 'Crear valor en un catálogo'
  @path: 'CreateValue'
  action CreateValue(value: Value) returns Value;

  @Core.Description: 'Crear valor en un catálogo'
  @path: 'updateValue'
  action updateValue(valueid:String, value: Value) returns Value;
  
  @Core.Description: 'Elimnar fisicamente un valor en un catálogo'
  @path: 'physicalDeleteValue'
  action physicalDeleteValue(valueid:String)  returns String;
  
  @Core.Description: 'Eliminar Logicamente valor en un catálogo'
  @path: 'logicalDeleteValue'
  action logicalDeleteValue(valueid:String) returns Value;
  
  @Core.Description: 'Activar Logicamnete un valor en un catálogo'
  @path: 'logicalActivateValue'
  action logicalActivateValue(valueid:String) returns Value;


  @Core .Description: 'Creacion de catalogos'
  @path: 'CreateCatalog'
  action CreateCatalog(catalogs : Catalog) returns Catalog; 

  @Core.Description: 'Borrado lógico de catalogo'
  @path: 'deletecatalogs'
  action deletecatalogs(labelid: String) returns String;
  
  @Core.Description: 'Activado lógico de catalogo'
  @path: 'activatecatalogs'
  action activatecatalogs(labelid: String) returns String;  
  
  @Core .Description: 'Actualizacion de catalogo'
  @path: 'updatecatalogs'
  action updatecatalogs(labelid: String, catalogs : Catalog) returns Catalog; 

  @Core.Description: 'Eliminado físico de catalogo'
  @path: 'removecatalog'
  action removecatalog(labelid: String) returns String;
  // ─── USUARIOS ─────────────────────────────────────────
  entity User as projection on s.User;
  @Core.Description: 'Obtener usuarios o usuario por ID (en el body se envía userid)'
  @path: 'users'
  function users(userid: String) returns array of User;
  
  @Core.Description: 'Obtener usuarios por el correo electrónico'
  @path: 'userEmail'
  function userEmail(email: String) returns array of User;

  @Core.Description: 'Obtener usuarios auqnue esten desactivados'
  @path: 'usersAll'
  function usersAll(userid: String) returns array of User;

  @Core.Description: 'Crear usuario'
  @path: 'createuser'
  action createuser(user: User) returns User;
  
  @Core.Description: 'Actualizar usuario'
  @path: 'updateuser'
  action updateuser(userid: String,usermod:String, user: User) returns User;
  
  @Core.Description: 'Borrado lógico de usuario'
  @path: 'deleteusers'
  action deleteusers(userid: String,usermod:String) returns String;

  @Core.Description: 'activado lógico de usuario'
  @path: 'activateusers'
  action activateusers(userid: String,usermod:String) returns String;
  

  @Core.Description: 'Eliminado físico de usuario'
  @path: 'removeuser'
  action removeuser(userid: String) returns String;

  // ─── ROLES ─────────────────────────────────────────
  entity Role as projection on s.Role;
  @Core.Description: 'Obtener roles o un rol por ID (con usuarios asociados si se envía roleid)'
  @path: 'roles'
  function roles(roleid: String) returns array of Role;
  
  @Core.Description: 'Crear rol'
  @path: 'createrole'
  action createrole(role: Role) returns Role;
  
  @Core.Description: 'Actualizar rol'
  @path: 'updaterole'
  action updaterole(roleid: String, role: Role) returns Role;
  
  @Core.Description: 'Borrado lógico de rol'
  @path: 'deleteroles'
  action deleteroles(roleid: String) returns String;
  
  @Core.Description: 'Eliminado físico de rol'
  @path: 'removerole'
  action removerole(roleid: String) returns String;

  // ─── VISTAS ─────────────────────────────────────────
  entity View  as projection on s.View;
  @Core.Description: 'Crear vista'
  @path: 'createview'
  action createview(view: View) returns View;
  
  @Core.Description: 'Actualizar vista'
  @path: 'updateview'
  action updateview(valueid: String, view: View) returns View;
  
  @Core.Description: 'Borrado lógico de vista'
  @path: 'deleteview'
  action deleteview(valueid: String) returns String;
  
  @Core.Description: 'Eliminado físico de vista'
  @path: 'deleteview'
  action removeview(valueid: String) returns String;

  // ─── PROCESOS ─────────────────────────────────────────
  entity Process as projection on s.Process;
  @Core.Description: 'Crear proceso'
  @path: 'createprocess'
  action createprocess(proc: Process) returns Process;
  
  @Core.Description: 'Actualizar proceso'
  @path: 'updateprocess'
  action updateprocess(valueid: String, proc: Process) returns Process;
  
  @Core.Description: 'Borrado lógico de proceso'
  @path: 'deleteprocess'
  action deleteprocess(valueid: String) returns String;
  
  @Core.Description: 'Eliminado físico de proceso'
  @path: 'removeprocess'
  action removeprocess(valueid: String) returns String;
}