const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert({
    // inserir dados para autenticar o usuario
  })
})

// nosso bucket no fire Storage
exports.bucket = admin.storage().bucket('// inserir auth do bucket')
