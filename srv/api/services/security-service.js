const mongoose = require('mongoose');
const ZtLabel = require('../models/mongodb/ztlabels-model');
const ZtValue = require('../models/mongodb/ztvalues-model');
const ZtUser  = require('../models/mongodb/ztusers-model');
const ZtRole  = require('../models/mongodb/ztroles-model');

// Función para conectar a MongoDB
async function connect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}

// ─── Funciones para Catálogos ───────────────────────────
async function getAllCatalogsWithValues() {
  await connect();
  const labels = await ZtLabel.find({ 'DETAIL_ROW.ACTIVED': true }).lean();
  return Promise.all(labels.map(async lbl => {
    const vals = await ZtValue.find({ LABELID: lbl.LABELID, 'DETAIL_ROW.ACTIVED': true }).lean();
    return { ...lbl, VALUES: vals };
  }));
}

async function getCatalogByLabel(req) {
  await connect();
  const { labelid } = req.data;
  if (!labelid) return null;
  const lbl = await ZtLabel.findOne({ LABELID: labelid }).lean();
  const vals = await ZtValue.find({ LABELID: labelid }).lean();
  return { ...lbl, VALUES: vals };
}

async function getCatalogByLabelAndValue(req) {
  await connect();
  const { labelid, valueid } = req.data;
  if (!labelid || !valueid) return null;

  const lbl = await ZtLabel.findOne({ LABELID: labelid }).lean();
  if (!lbl) return null;

  const val = await ZtValue.findOne({ LABELID: labelid, VALUEID: valueid }).lean();
  if (!val) return null;

  return {
    ...lbl,
    VALUES: [val]
  };
}


async function getAllCatalogsByLabelForCompanie(req) {
    await connect();
  const { labelid } = req.data;
  if (!labelid) return null;

  const value = await ZtValue.find({ VALUEPAID:  "IdCompanies-"+labelid }).lean();
  if (!value) return null;


  return {
   value
  };
}

async function getAllCatalogs() {
  await connect();
  const labels = await ZtLabel.find().lean();
  return Promise.all(labels.map(async lbl => {
    const vals = await ZtValue.find().lean();
    return { ...lbl, VALUES: vals };
  }));
}

async function CreateValue(req) {
  await connect();
  const valuePlano = JSON.parse(JSON.stringify(req.data.value));
  const nuevoValor = await ZtValue.create(valuePlano);  
  return JSON.parse(JSON.stringify(nuevoValor));
}

async function updateValue(req) {
    await connect();
    const valueid = req._.req.query.valueid;
    if (!valueid) {
      throw new Error('No se proporcionó labelid en la query string');
    }
    const valuePayload = req.data.value;
    await ZtValue.updateOne({ VALUEID: valueid }, valuePayload);
    return ZtValue.findOne({ VALUEID: valueid }).lean();
}

 async function logicalDeleteValue(req) {
    await connect();
    const  valueid  = req._.req.query.valueid;
    if (!valueid) {
      throw new Error('No se proporcionó labelid en la query string');
    }
    await ZtValue.updateOne(
      { VALUEID: valueid },
      {
        'DETAIL_ROW.ACTIVED': false,
        'DETAIL_ROW.DELETED': true
      }
    );
    return ZtValue.findOne({ VALUEID: valueid }).lean() || 'Value no encontrado para borrado lógico';
  }
 async function logicalActivateValue(req) {
    await connect();
    const  valueid  = req._.req.query.valueid;
    if (!valueid) {
      throw new Error('No se proporcionó labelid en la query string');
    }
    await ZtValue.updateOne(
      { VALUEID: valueid },
      {
        'DETAIL_ROW.ACTIVED': true,
        'DETAIL_ROW.DELETED': false
      }
    );
    return ZtValue.findOne({ VALUEID: valueid }).lean() || 'Value no encontrado para borrado lógico';
  }

  async function physicalDeleteValue(req) {
    await connect();
    const valueid = req._.req.query.valueid;
    if (!valueid) {
      throw new Error('No se proporcionó labelid en la query string');
    }
    const result = await ZtValue.deleteOne({ VALUEID: valueid });
    
 return result.deletedCount === 1 ? 'Borrado físicamente' : 'Usuario no encontrado para borrado físico';
  }





async function CreateCatalog(req) {
  await connect();
  const catalogoPlano = JSON.parse(JSON.stringify(req.data.catalogs));
  const nuevoCatalogo = await ZtLabel.create(catalogoPlano);
  return JSON.parse(JSON.stringify(nuevoCatalogo));
}

async function catalogs(req) {
  const { labelid, valueid } = req.data || {};
  if (labelid && valueid) {
    return getCatalogByLabelAndValue(req);
  } else if (labelid) {
    return getCatalogByLabel(req);
  } else {
    return getAllCatalogsWithValues();
  }
}
async function updateCatalog(req) {
    await connect();
    const labelid = req._.req.query.labelid;
    console.log('labelid', labelid);
    if (!labelid) {
      throw new Error('No se proporcionó labelid en la query string');
    }
    const catalogPayload = req.data.catalogs;
    console.log('labelid medio  ', labelid);
    await ZtLabel.updateOne({ LABELID: labelid }, catalogPayload);
    return ZtLabel.findOne({ LABELID: labelid }).lean();
  }
 
  async function logicalDeleteCatalog(req) {
    await connect();
    const  labelid  = req._.req.query.labelid;
    if (!labelid) {
      throw new Error('No se proporcionó labelid en la query string');
    }
    await ZtLabel.updateOne(
      { LABELID: labelid },
      {
        'DETAIL_ROW.ACTIVED': false,
        'DETAIL_ROW.DELETED': true
      }
    );
    return ZtLabel.findOne({ LABELID: labelid }).lean() || 'Usuario no encontrado para borrado lógico';
  }

    async function logicalActivateCatalog(req) {
    await connect();
    const  labelid  = req._.req.query.labelid;
    if (!labelid) {
      throw new Error('No se proporcionó labelid en la query string');
    }
    await ZtLabel.updateOne(
      { LABELID: labelid },
      {
        'DETAIL_ROW.ACTIVED': true,
        'DETAIL_ROW.DELETED': false
      }
    );
    return ZtLabel.findOne({ LABELID: labelid }).lean() || 'Usuario no encontrado para Activado lógico';
  }

  async function physicalDeleteCatalog(req) {
    await connect();
    const labelid = req._.req.query.labelid;
    if (!labelid) {
      throw new Error('No se proporcionó labelid en la query string');
    }
    const result = await ZtLabel.deleteOne({ LABELID: labelid });
    return result.deletedCount === 1 ? 'Borrado físicamente' : 'Usuario no encontrado para borrado físico';
  }

// ─── Funciones para Usuarios ─────────────────────────────
async function getAllUsersDesactive() {
  await connect();
  return ZtUser.find().lean();
}
async function getAllUsers() {
  await connect();
  return ZtUser.find({ 'DETAIL_ROW.ACTIVED': true }).lean();
}

async function getUserById(req) {
  await connect();
  const { userid } = req.data;
  if (!userid) return null;
  return ZtUser.findOne({ USERID: userid }).lean();
}

async function getUserByEmail(req) {
  await connect();
  const { email } = req.data;
  if (!email) return null;
  return ZtUser.findOne({ EMAIL: email }).lean();
}


async function createUser(req) {
  await connect();
  const usuarioPlano = JSON.parse(JSON.stringify(req.data.user));
  const usaurio = req._.req.query.usermod || usuarioPlano.USERID || 'SYSTEM';
  const now = new Date().toISOString();

  // Crear el historial inicial
  usuarioPlano.DETAIL_ROW = usuarioPlano.DETAIL_ROW || {};
  usuarioPlano.DETAIL_ROW.DETAIL_ROW_REG = [
    {
      CURRENT: true,
      REGDATE: now,
      REGTIME: now,
      REGUSER: usaurio
    }
  ];

  const nuevoUsuario = await ZtUser.create(usuarioPlano);
  return JSON.parse(JSON.stringify(nuevoUsuario));
}

async function updateUser(req) {
  await connect();
  const userid = req._.req.query.userid;
  if (!userid) {
    throw new Error('No se proporcionó userid en la query string');
  }
  const userPayload = req.data.user;
  const userVerification = req.data.user.USERID;
  const usaurio = req._.req.query.usermod;
  const now = new Date().toISOString();

   // Obtener el usuario actual para manipular DETAIL_ROW_REG dentro de DETAIL_ROW
  const userDb = await ZtUser.findOne({ USERID: userid }).lean();
  let detailRowReg = [];

  if (userDb && userDb.DETAIL_ROW && Array.isArray(userDb.DETAIL_ROW.DETAIL_ROW_REG)) {
    // Cambiar todos los CURRENT existentes a false
    detailRowReg = userDb.DETAIL_ROW.DETAIL_ROW_REG.map(reg => ({ ...reg, CURRENT: false }));
  }

  // Agregar el nuevo registro al final
  detailRowReg.push({
    CURRENT: true,
    REGDATE: now,
    REGTIME: now,
    REGUSER: usaurio
  });

  // Asegura que DETAIL_ROW sea un objeto
  if (!userPayload.DETAIL_ROW || typeof userPayload.DETAIL_ROW !== 'object') userPayload.DETAIL_ROW = {};
  userPayload.DETAIL_ROW.DETAIL_ROW_REG = detailRowReg;

  await ZtUser.updateOne({ USERID: userid }, { $set: userPayload });
  return ZtUser.findOne({ USERID: userVerification }).lean();
}

async function logicalDeleteUser(req) {
   await connect();
  const userid = req._.req.query.userid;
  if (!userid) {
    throw new Error('No se proporcionó userid en la query string');
  }
  const usaurio = req._.req.query.usermod;
  const now = new Date().toISOString();

  // Obtener el usuario actual para manipular DETAIL_ROW_REG dentro de DETAIL_ROW
  const userDb = await ZtUser.findOne({ USERID: userid }).lean();
  let detailRowReg = [];

  if (userDb && userDb.DETAIL_ROW && Array.isArray(userDb.DETAIL_ROW.DETAIL_ROW_REG)) {
    // Cambiar todos los CURRENT existentes a false
    detailRowReg = userDb.DETAIL_ROW.DETAIL_ROW_REG.map(reg => ({ ...reg, CURRENT: false }));
  }

  // Agregar el nuevo registro al final
  detailRowReg.push({
    CURRENT: true,
    REGDATE: now,
    REGTIME: now,
    REGUSER: usaurio
  });

  // Construir el payload para actualizar
  const userPayload = {};
  userPayload['DETAIL_ROW.DETAIL_ROW_REG'] = detailRowReg;
  userPayload['DETAIL_ROW.ACTIVED'] = false;
  userPayload['DETAIL_ROW.DELETED'] = true;

  await ZtUser.updateOne(
    { USERID: userid },
    { $set: userPayload }
  );
  return ZtUser.findOne({ USERID: userid }).lean() || 'Usuario no encontrado para activado lógico';
}

async function logicalActivateUser(req) {
   await connect();
  const userid = req._.req.query.userid;
  if (!userid) {
    throw new Error('No se proporcionó userid en la query string');
  }
  const usaurio = req._.req.query.usermod;
  const now = new Date().toISOString();

  // Obtener el usuario actual para manipular DETAIL_ROW_REG dentro de DETAIL_ROW
  const userDb = await ZtUser.findOne({ USERID: userid }).lean();
  let detailRowReg = [];

  if (userDb && userDb.DETAIL_ROW && Array.isArray(userDb.DETAIL_ROW.DETAIL_ROW_REG)) {
    // Cambiar todos los CURRENT existentes a false
    detailRowReg = userDb.DETAIL_ROW.DETAIL_ROW_REG.map(reg => ({ ...reg, CURRENT: false }));
  }

  // Agregar el nuevo registro al final
  detailRowReg.push({
    CURRENT: true,
    REGDATE: now,
    REGTIME: now,
    REGUSER: usaurio
  });

  // Construir el payload para actualizar
  const userPayload = {};
  userPayload['DETAIL_ROW.DETAIL_ROW_REG'] = detailRowReg;
  userPayload['DETAIL_ROW.ACTIVED'] = true;
  userPayload['DETAIL_ROW.DELETED'] = false;

  await ZtUser.updateOne(
    { USERID: userid },
    { $set: userPayload }
  );
  return ZtUser.findOne({ USERID: userid }).lean() || 'Usuario no encontrado para activado lógico';
}

async function physicalDeleteUser(req) {
  await connect();
  const userid = req._.req.query.userid;
  if (!userid) {
    throw new Error('No se proporcionó userid en la query string');
  }
  const result = await ZtUser.deleteOne({ USERID: userid });
  return result.deletedCount === 1 ? 'Borrado físicamente' : 'Usuario no encontrado para borrado físico';
}

async function users(req) {
  const { userid } = req.data || {};
  if (userid && userid.trim() !== '') {
    const user = await getUserById(req);
    return user ? [user] : [];
  } else {
    return getAllUsers();
  }
}

async function userEmail(req) {
  await connect();
  const { email } = req.data;
  if (!email) return [];
  const user = await ZtUser.findOne({ EMAIL: email }).lean();
  return user ? [user] : [];
}

// ─── Funciones para Roles ────────────────────────────────
async function getAllRoles() {
  await connect();
  // Trae todos los roles, sin filtrar por ACTIVED
  const roles = await ZtRole.find({}).lean();
  return roles;
}

async function getRoleById(req) {
  await connect();
  const { roleid } = req.data;
  if (!roleid) return null;
  //guardamos los roles en una variable aunque se puede hacer directo lo hacemos asi para que sea mas legible
  const role = await ZtRole.findOne({ ROLEID: roleid }).lean();
  //la retornamos
  return role;
}

async function getUsersByRole(req) {
  await connect();
  const { roleid } = req.data;
  if (!roleid) return [];
  const users = await ZtUser.find({ 'ROLES.ROLEID': roleid, 'DETAIL_ROW.ACTIVED': true }).lean();
  return users.map(u => ({
    USERID: u.USERID,
    USERNAME: u.USERNAME,
    COMPANYNAME: u.COMPANYNAME,
    DEPARTMENT: u.DEPARTMENT
  }));
}

async function createRole(req) {
  await connect();
  // Extraemos el objeto role de req.data
  const rolePlano = JSON.parse(JSON.stringify(req.data.role));

  // Aquí podrías validar procesos y privilegios antes de crear
  const nuevoRol = await ZtRole.create(rolePlano);
  return JSON.parse(JSON.stringify(nuevoRol));
}


async function updateRole(req) {
  await connect();
  // roleid se pasa por query string para mantener consistencia con users
  const roleid = req._.req.query.roleid;
  if (!roleid) {
    throw new Error('No se proporcionó roleid en la query string');
  }
  const rolePayload = req.data.role;
  await ZtRole.updateOne({ ROLEID: roleid }, rolePayload);
  return ZtRole.findOne({ ROLEID: roleid }).lean();
}

async function logicalDeleteRole(req) {
  await connect();
  const roleid = req.data.roleid;
  if (!roleid) {
    throw new Error('No se proporcionó roleid en el body');
  }
  await ZtRole.updateOne(
    { ROLEID: roleid },
    {
      'DETAIL_ROW.ACTIVED': false,
      'DETAIL_ROW.DELETED': true
    }
  );
  return ZtRole.findOne({ ROLEID: roleid }).lean() || 'Rol no encontrado para borrado lógico';
}

async function logicalActivateRole(req) {
  await connect();
  const roleid = req.data.roleid;
  if (!roleid) {
    throw new Error('No se proporcionó roleid en el body');
  }
  await ZtRole.updateOne(
    { ROLEID: roleid },
    {
      'DETAIL_ROW.ACTIVED': true,
      'DETAIL_ROW.DELETED': false
    }
  );
  return ZtRole.findOne({ ROLEID: roleid }).lean() || 'Rol no encontrado para activado lógico';
}

async function physicalDeleteRole(req) {
  await connect();
  const roleid = req._.req.query.roleid;
  if (!roleid) {
    throw new Error('No se proporcionó roleid en la query string');
  }
  const result = await ZtRole.deleteOne({ ROLEID: roleid });
  return result.deletedCount === 1 ? 'Borrado físicamente' : 'Rol no encontrado para borrado físico';
}

async function roles(req) {
  const { roleid } = req.data || {};
  if (roleid && roleid.trim() !== '') {
    const role = await getRoleById(req);
    return role ? [role] : [];
  } else {
    return getAllRoles();
  }
}

module.exports = {
  // Catálogos
  getAllCatalogsWithValues,
  getCatalogByLabel,
  getCatalogByLabelAndValue,
  getAllCatalogs,
  CreateCatalog,
  CreateValue,
  catalogs,
  physicalDeleteValue,
  logicalDeleteValue,
  logicalActivateValue,
  updateValue,
  logicalDeleteCatalog,
  updateCatalog,
  physicalDeleteCatalog,
  logicalActivateCatalog,
  getAllCatalogsByLabelForCompanie,
  // Usuarios
  getAllUsers,
  getUserById,
  getUserByEmail,
  getAllUsersDesactive,
  createUser,
  updateUser,
  logicalDeleteUser,
  logicalActivateUser,
  physicalDeleteUser,
  users,
  userEmail,
  // Roles
  getAllRoles,
  getRoleById,
  getUsersByRole,
  createRole,
  updateRole,
  logicalDeleteRole,
  logicalActivateRole,
  physicalDeleteRole,
  roles
};