const cds = require('@sap/cds');
const svc = require('../services/security-service');

class SecurityController extends cds.ApplicationService {
  async init() {
    // ─── CATÁLOGOS ─────────────────────────────
    this.on('catalogs', async (req) => {
      return svc.catalogs(req);
    });

    this.on('deletecatalogs', async (req) => {
      return svc.logicalDeleteCatalog(req);
    });

    
    this.on('updatecatalogs', async (req) => {
      return svc.updateCatalog(req);
    });
    
    this.on('removecatalog', async (req) => {
      return svc.physicalDeleteCatalog(req);
    });

    
    this.on('catalogsCompanie', async (req) => {
      return svc.getAllCatalogsByLabelForCompanie(req);
    });   

    // ─── USUARIOS ─────────────────────────────
    // GET: Obtener usuarios o un usuario específico (según query param "userid")
    this.on('users', async (req) => {
      return svc.users(req);
    });
    
    this.on('usersAll', async (req) => {
      return svc.getAllUsersDesactive(req);
    });
    // GET: Obtener un usuario por su email
    this.on('userEmail', async (req) => {
      return svc.getUserByEmail(req);
    });

    // POST: Crear usuario
    this.on('createuser', async (req) => {
      return svc.createUser(req);
    });

    // PATCH: Actualizar usuario (se espera que userid venga en params)
    this.on('updateuser', async (req) => {
      return svc.updateUser(req);
    });

    // PATCH (para borrado lógico) y DELETE (para borrado físico) de usuario
    this.on('deleteusers', async (req) => {
      return svc.logicalDeleteUser(req);
    });

    this.on('activateusers', async (req) => {
      return svc.logicalActivateUser(req);
    });

    this.on('removeuser', async (req) => {
      return svc.physicalDeleteUser(req);
    });

    // ─── ROLES ─────────────────────────────
    // GET: Obtener roles o un rol específico (con usuarios asociados si se filtra)
    this.on('roles', async (req) => {
      return svc.roles(req);
    });

    // POST: Crear rol
    this.on('createrole', async (req) => {
      return svc.createRole(req);
    });

    // PUT: Actualizar rol (se espera que roleid venga en params)
    this.on('updaterole', async (req) => {
      return svc.updateRole(req);
    });

    // PATCH (borrado lógico) y DELETE (eliminado físico) de rol
    this.on('deleteroles', async (req) => {
      return svc.logicalDeleteRole(req);
    });

    this.on('removerole', async (req) => {
      return svc.physicalDeleteRole(req);
    });

    // ─── VISTAS ─────────────────────────────
    this.on('createview', async (req) => {
      // Se puede implementar la lógica real; por el momento se retorna un stub.
      return { message: 'createview no implementado' };
    });
    this.on('updateview', async (req) => {
      return { message: 'updateview no implementado' };
    });
    this.on('deleteview', async (req) => {
      return { message: 'deleteview no implementado' };
    });

    // ─── PROCESOS ─────────────────────────────
    this.on('createprocess', async (req) => {
      return { message: 'createprocess no implementado' };
    });
    this.on('updateprocess', async (req) => {
      return { message: 'updateprocess no implementado' };
    });
    // Se diferencia borrado lógico (PATCH) y eliminación física (DELETE)
    this.on('deleteprocess', async (req) => {
      if (req.method === 'DELETE') {
        return { message: 'removeprocess no implementado' };
      } else {
        return { message: 'deleteprocess no implementado' };
      }
    });

    return await super.init();
  }
}

module.exports = SecurityController;