const connection = require('../database/connection')

module.exports = {
    async get(req, res) {
        const bytes = req.body.bytes

        const totalBytes = await connection('bytes').select('*')

        return res.json( totalBytes[0] )
    }
}
