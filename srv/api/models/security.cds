namespace security;

// --- Tipos de detalle de registro ---
type DetailRowReg {
    CURRENT   : Boolean;
    REGDATE   : DateTime;
    REGTIME   : DateTime;
    REGUSER   : String;
}

type DetailRow {
    ACTIVED         : Boolean;
    DELETED         : Boolean;
    DETAIL_ROW_REG  : Array of DetailRowReg;
}

// === ENTIDADES BASE ===

entity Catalog {
    COMPANYID   : String;
    CEDIID      : String;
    LABELID     : String;
    LABEL       : String;
    INDEX       : String;
    COLLECTION  : String;
    SECTION     : String;
    SEQUENCE    : Integer;
    IMAGE       : String;
    DESCRIPTION : String;
    DETAIL_ROW  : DetailRow;
}

entity Value {
    COMPANYID   : String;
    CEDIID      : String;
    LABELID     : String;
    VALUEPAID   : String;
    VALUEID     : String;
    VALUE       : String;
    ALIAS       : String;
    SEQUENCE    : Integer;
    IMAGE       : String;
    VALUESAPID  : String;
    DESCRIPTION : String;
    ROUTE       : String;
    DETAIL_ROW  : DetailRow;
}

entity CatalogWithValues {
    COMPANYID   : String;
    CEDIID      : String;
    LABELID     : String;
    LABEL       : String;
    INDEX       : String;
    COLLECTION  : String;
    SECTION     : String;
    SEQUENCE    : Integer;
    IMAGE       : String;
    DESCRIPTION : String;
    DETAIL_ROW  : DetailRow;
    VALUES      : Composition of many Value;
}

type RoleData : {
    ROLEID    : String;
    ROLEIDSAP : String;
};

entity User {
    USERID         : String;
    PASSWORD       : String;
    USERNAME       : String;
    ALIAS          : String;
    FIRSTNAME      : String;
    LASTNAME       : String;
    BIRTHDAYDATE   : String;
    COMPANYID      : String;
    COMPANYNAME    : String;
    COMPANYALIAS   : String;
    CEDIID         : String;
    EMPLOYEEID     : String;
    EMAIL          : String;
    PHONENUMBER    : String;
    EXTENSION      : String;
    DEPARTMENT     : String;
    FUNCTION       : String;
    STREET         : String;
    POSTALCODE     : Integer;
    CITY           : String;
    REGION         : String;
    STATE          : String;
    COUNTRY        : String;
    AVATAR         : String;
    ROLES          : Array of RoleData;
    DETAIL_ROW     : DetailRow;
    STOCK          : Double;
    SHARES         : Integer;
}

// === NUEVOS TIPOS PARA ROLES ===

// Cada entrada de privilegio agrupa un proceso y sus privilegios
type PrivilegeData : {
    PROCESSID    : String;
    PRIVILEGEID  : Array of String;
}

// === ENTIDADES DE ROLES ===

entity Role {
    ROLEID        : String;
    ROLENAME      : String;
    DESCRIPTION   : String;
    // Ahora un arreglo de estructuras en lugar de String
    APP: String;
    PRIVILEGES    : Array of PrivilegeData;
    DETAIL_ROW    : DetailRow;
}

// === ENTIDADES INDEPENDIENTES: PROCESOS Y VISTAS ===

entity Process {
    COMPANYID   : String;
    CEDIID      : String;
    LABELID     : String;         // "IdProcesses"
    VALUEPAID   : String;
    VALUEID     : String;
    VALUE       : String;
    ALIAS       : String;
    SEQUENCE    : Integer;
    IMAGE       : String;
    VALUESAPID  : String;
    DESCRIPTION : String;
    DETAIL_ROW  : DetailRow;
}

entity View {
    COMPANYID   : String;
    CEDIID      : String;
    LABELID     : String;         // "IdViews"
    VALUEPAID   : String;
    VALUEID     : String;
    VALUE       : String;
    ALIAS       : String;
    SEQUENCE    : Integer;
    IMAGE       : String;
    VALUESAPID  : String;
    DESCRIPTION : String;
    ROUTE       : String;
    DETAIL_ROW  : DetailRow;
}

