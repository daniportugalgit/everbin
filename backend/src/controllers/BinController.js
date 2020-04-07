const connection = require('../database/connection')

module.exports = {
    async create(req, res) {
        const bytes = req.body.bytes

        result = await connection('bytes').select('*')
                
        if(result.length == 0) {
            await connection('bytes').insert({ total_bytes: bytes })
        } else {
            await connection('bytes').increment('total_bytes', bytes)
        }

        const totalBytes = await connection('bytes').select('*')

        return res.json( totalBytes[0] )
    }
}
