const mongoose = require("mongoose");
const ZtLabel = require("../models/mongodb/ztlabels-model");
const ZtValue = require("../models/mongodb/ztvalues-model");
const ZtUser = require("../models/mongodb/ztusers-model");
const ZtRole = require("../models/mongodb/ztroles-model");

// Función para conectar a MongoDB
async function connect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

// ─── Funciones para Catálogos ───────────────────────────
async function getAllCatalogsWithValues() {
  await connect();
  const labels = await ZtLabel.find({ "DETAIL_ROW.ACTIVED": true }).lean();
  return Promise.all(
    labels.map(async (lbl) => {
      const vals = await ZtValue.find({
        LABELID: lbl.LABELID,
        "DETAIL_ROW.ACTIVED": true,
      }).lean();
      return { ...lbl, VALUES: vals };
    })
  );
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

  const val = await ZtValue.findOne({
    LABELID: labelid,
    VALUEID: valueid,
  }).lean();
  if (!val) return null;

  return {
    ...lbl,
    VALUES: [val],
  };
}

async function getAllCatalogsByLabelForCompanie(req) {
  await connect();
  const { labelid } = req.data;
  if (!labelid) return null;

  const value = await ZtValue.find({
    VALUEPAID: "IdCompanies-" + labelid,
  }).lean();
  if (!value) return null;

  return {
    value,
  };
}

async function getAllCatalogs() {
  await connect();
  const labels = await ZtLabel.find().lean();
  return Promise.all(
    labels.map(async (lbl) => {
      const vals = await ZtValue.find().lean();
      return { ...lbl, VALUES: vals };
    })
  );
}

async function CreateValue(req) {
  await connect();
  const valuePlano = JSON.parse(JSON.stringify(req.data.value));
  const nuevoValor = await ZtValue.create(valuePlano);
  return JSON.parse(JSON.stringify(nuevoValor));
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
  console.log("labelid", labelid);
  if (!labelid) {
    throw new Error("No se proporcionó labelid en la query string");
  }
  const catalogPayload = req.data.catalogs;
  console.log("labelid medio  ", labelid);
  await ZtLabel.updateOne({ LABELID: labelid }, catalogPayload);
  return ZtLabel.findOne({ LABELID: labelid }).lean();
}

async function logicalDeleteCatalog(req) {
  await connect();
  const labelid = req._.req.query.labelid;
  if (!labelid) {
    throw new Error("No se proporcionó labelid en la query string");
  }
  await ZtLabel.updateOne(
    { LABELID: labelid },
    {
      "DETAIL_ROW.ACTIVED": false,
      "DETAIL_ROW.DELETED": true,
    }
  );
  return (
    ZtLabel.findOne({ LABELID: labelid }).lean() ||
    "Usuario no encontrado para borrado lógico"
  );
}

async function logicalActivateCatalog(req) {
  await connect();
  const labelid = req._.req.query.labelid;
  if (!labelid) {
    throw new Error("No se proporcionó labelid en la query string");
  }
  await ZtLabel.updateOne(
    { LABELID: labelid },
    {
      "DETAIL_ROW.ACTIVED": true,
      "DETAIL_ROW.DELETED": false,
    }
  );
  return (
    ZtLabel.findOne({ LABELID: labelid }).lean() ||
    "Usuario no encontrado para Activado lógico"
  );
}

async function physicalDeleteCatalog(req) {
  await connect();
  const labelid = req._.req.query.labelid;
  if (!labelid) {
    throw new Error("No se proporcionó labelid en la query string");
  }
  const result = await ZtLabel.deleteOne({ LABELID: labelid });
  return result.deletedCount === 1
    ? "Borrado físicamente"
    : "Usuario no encontrado para borrado físico";
}

async function physicalDeleteValue(req) {
  await connect();
  console.log("REQ.DATA EN BACKEND:", req.data); // <--- AGREGA ESTO
  // Puedes obtener los parámetros desde req.data (por POST con body)
  const { labelid, valueid } = req.data;
  if (!labelid || !valueid) {
    throw new Error("No se proporcionó labelid o valueid en el body");
  }
  const result = await ZtValue.deleteOne({
    LABELID: labelid,
    VALUEID: valueid,
  });
  return result.deletedCount === 1
    ? { success: true }
    : { success: false, error: "Value no encontrado para borrado físico" };
}

// ─── Funciones para Usuarios ─────────────────────────────
async function getAllUsersDesactive() {
  await connect();
  return ZtUser.find().lean();
}
async function getAllUsers() {
  await connect();
  return ZtUser.find({ "DETAIL_ROW.ACTIVED": true }).lean();
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
  const nuevoUsuario = await ZtUser.create(usuarioPlano);
  return JSON.parse(JSON.stringify(nuevoUsuario));
}

async function updateUser(req) {
  await connect();
  const userid = req._.req.query.userid;
  if (!userid) {
    throw new Error("No se proporcionó userid en la query string");
  }
  const userPayload = req.data.user;
  await ZtUser.updateOne({ USERID: userid }, userPayload);
  return ZtUser.findOne({ USERID: userid }).lean();
}

async function logicalDeleteUser(req) {
  await connect();
  const userid = req._.req.query.userid;
  if (!userid) {
    throw new Error("No se proporcionó userid en la query string");
  }
  await ZtUser.updateOne(
    { USERID: userid },
    {
      "DETAIL_ROW.ACTIVED": false,
      "DETAIL_ROW.DELETED": true,
    }
  );
  return (
    ZtUser.findOne({ USERID: userid }).lean() ||
    "Usuario no encontrado para borrado lógico"
  );
}

async function logicalActivateUser(req) {
  await connect();
  const userid = req._.req.query.userid;
  if (!userid) {
    throw new Error("No se proporcionó userid en la query string");
  }
  await ZtUser.updateOne(
    { USERID: userid },
    {
      "DETAIL_ROW.ACTIVED": true,
      "DETAIL_ROW.DELETED": false,
    }
  );
  return (
    ZtUser.findOne({ USERID: userid }).lean() ||
    "Usuario no encontrado para activado lógico"
  );
}

async function physicalDeleteUser(req) {
  await connect();
  const userid = req._.req.query.userid;
  if (!userid) {
    throw new Error("No se proporcionó userid en la query string");
  }
  const result = await ZtUser.deleteOne({ USERID: userid });
  return result.deletedCount === 1
    ? "Borrado físicamente"
    : "Usuario no encontrado para borrado físico";
}

async function users(req) {
  const { userid } = req.data || {};
  if (userid && userid.trim() !== "") {
    const user = await getUserById(req);
    return user ? [user] : [];
  } else {
    return getAllUsers();
  }
}

// ─── Funciones para Roles ────────────────────────────────
async function getAllRoles() {
  await connect();
  return ZtRole.find({ "DETAIL_ROW.ACTIVED": true }).lean();
}

async function getRoleById(req) {
  await connect();
  const { roleid } = req.data;
  if (!roleid) return null;
  return ZtRole.findOne({ ROLEID: roleid }).lean();
}

async function getUsersByRole(req) {
  await connect();
  const { roleid } = req.data;
  if (!roleid) return [];
  const users = await ZtUser.find({
    "ROLES.ROLEID": roleid,
    "DETAIL_ROW.ACTIVED": true,
  }).lean();
  return users.map((u) => ({
    USERID: u.USERID,
    USERNAME: u.USERNAME,
    COMPANYNAME: u.COMPANYNAME,
    DEPARTMENT: u.DEPARTMENT,
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
    throw new Error("No se proporcionó roleid en la query string");
  }
  const rolePayload = req.data.role;
  await ZtRole.updateOne({ ROLEID: roleid }, rolePayload);
  return ZtRole.findOne({ ROLEID: roleid }).lean();
}

async function logicalDeleteRole(req) {
  await connect();
  const roleid = req._.req.query.roleid;
  if (!roleid) {
    throw new Error("No se proporcionó roleid en la query string");
  }
  await ZtRole.updateOne(
    { ROLEID: roleid },
    {
      "DETAIL_ROW.ACTIVED": false,
      "DETAIL_ROW.DELETED": true,
    }
  );
  return (
    ZtRole.findOne({ ROLEID: roleid }).lean() ||
    "Rol no encontrado para borrado lógico"
  );
}

async function logicalActivateRole(req) {
  await connect();
  const roleid = req._.req.query.roleid;
  if (!roleid) {
    throw new Error("No se proporcionó roleid en la query string");
  }
  await ZtRole.updateOne(
    { ROLEID: roleid },
    {
      "DETAIL_ROW.ACTIVED": true,
      "DETAIL_ROW.DELETED": false,
    }
  );
  return (
    ZtRole.findOne({ ROLEID: roleid }).lean() ||
    "Rol no encontrado para activado lógico"
  );
}

async function physicalDeleteRole(req) {
  await connect();
  const roleid = req._.req.query.roleid;
  if (!roleid) {
    throw new Error("No se proporcionó roleid en la query string");
  }
  const result = await ZtRole.deleteOne({ ROLEID: roleid });
  return result.deletedCount === 1
    ? "Borrado físicamente"
    : "Rol no encontrado para borrado físico";
}

async function roles(req) {
  const { roleid } = req.data || {};
  if (roleid && roleid.trim() !== "") {
    // Para operaciones GET compuestas: leemos roleid de req.data
    const role = await getRoleById(req);
    if (!role) return null;
    const usersArr = await getUsersByRole(req);
    role.USERS = usersArr;
    return role;
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
  logicalDeleteCatalog,
  updateCatalog,
  physicalDeleteCatalog,
  physicalDeleteValue,
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
  // Roles
  getAllRoles,
  getRoleById,
  getUsersByRole,
  createRole,
  updateRole,
  logicalDeleteRole,
  logicalActivateRole,
  physicalDeleteRole,
  roles,
};
