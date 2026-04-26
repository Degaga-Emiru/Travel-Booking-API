const { AuditLog } = require('../models');

/**
 * Log an administrative action
 * @param {string} adminId - ID of the admin performing the action
 * @param {string} action - Descriptive action name (e.g., 'APPROVE_VENDOR')
 * @param {string} resourceType - Type of resource being modified
 * @param {string} resourceId - ID of the resource being modified
 * @param {Object} details - Additional JSON data about the action
 * @param {string} ipAddress - IP address of the admin
 */
const logAdminAction = async (adminId, action, resourceType, resourceId, details = {}, ipAddress = '') => {
  try {
    await AuditLog.create({
      adminId,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('Audit Logging Failed:', error);
  }
};

module.exports = { logAdminAction };
