const { Schema, model } = require('mongoose');

const ZtRoleSchema = new Schema({
  ROLEID:      { type: String, required: true, unique: true },
  ROLENAME:    { type: String },
  DESCRIPTION: { type: String },
  APP:{type: String, default: 'DAM'},
  PRIVILEGES: [
    {
      PROCESSID:   { type: String },
      PRIVILEGEID: [ { type: String } ]
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
  }
}, {
  collection: 'ZTROLES',
  timestamps: false
});

module.exports = model('ZTROLES', ZtRoleSchema, 'ZTROLES');