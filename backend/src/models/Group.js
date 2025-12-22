const mongoose = require('mongoose');

const auditSchema = mongoose.Schema({
  action: { type: String, required: true }, // e.g., "MEMBER_KICKED", "EXPENSE_DELETED"
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  timestamp: { type: Date, default: Date.now }
});

const groupSchema = mongoose.Schema({
  name: { type: String, required: true },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  auditLog: [auditSchema]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);