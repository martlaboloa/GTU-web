const confogStoreProd = require('./configureStore.prod')
const confogStoreDev = require('./configureStore.dev')

if (process.env.NODE_ENV === 'production') {
  module.exports = confogStoreProd
} else {
  module.exports = confogStoreDev
}
