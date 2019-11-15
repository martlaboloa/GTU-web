/**
 * @typedef {Object} Action
 * @property {string} type
 * @property {?Object} payload
 * @property {?Object} meta
 */

/**
 * @param {string} type
 * @param {object} payload
 * @param {object} meta
 * @returns {Action}
 */
export default (type, payload = {}, meta = {}) => ({
  type,
  payload,
  meta,
})

