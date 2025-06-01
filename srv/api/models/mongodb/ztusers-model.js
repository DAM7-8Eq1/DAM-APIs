const { Schema, model } = require('mongoose');

const ZtUserSchema = new Schema({
  USERID:       { type: String, required: true, unique: true },
  PASSWORD:     { type: String },
  USERNAME:     { type: String },
  ALIAS:        { type: String },
  FIRSTNAME:    { type: String },
  LASTNAME:     { type: String },
  BIRTHDAYDATE: { type: String },
  COMPANYID:    { type: Number },
  COMPANYNAME:  { type: String },
  COMPANYALIAS: { type: String },
  CEDIID:       { type: String },
  EMPLOYEEID:   { type: String },
  EMAIL:        { type: String },
  PHONENUMBER:  { type: String },
  EXTENSION:    { type: String },
  DEPARTMENT:   { type: String },
  FUNCTION:     { type: String },
  STREET:       { type: String },
  POSTALCODE:   { type: Number },
  CITY:         { type: String },
  REGION:       { type: String },
  STATE:        { type: String },
  COUNTRY:      { type: String },
  AVATAR:       { type: String },
  ROLES: [
    {
      ROLEID:   { type: String },
      ROLEIDSAP:{ type: String }
    }
  ],
  DETAIL_ROW: {
    ACTIVED:  { type: Boolean, default: true },
    DELETED:  { type: Boolean, default: false },
    DETAIL_ROW_REG: [
      {
        CURRENT: { type: Boolean },
        REGDATE: { type: Date },
        REGTIME: { type: Date },
        REGUSER: { type: String }
      }
    ]
  },
  STOCK: { type: Number},
  SHARES: { type: Number }
}, {
  collection: 'ZTUSERS',
  timestamps: false
});

module.exports = model('ZTUSERS', ZtUserSchema, 'ZTUSERS');