// import { ironSession } from 'utils/ironSession'
// import { ObjectId } from 'mongodb'
// import { connectToDatabase } from 'utils/mongodb'

// import audit from 'utils/audit'

// import services from 'services'

// async function handler(req, res) {
//     const user = req.session.get("user")

//     let { query } = req
//     let { tileInfo } = query

//     let tileType = tileInfo[0]
//     let tileId = tileInfo[1]

//     if (services[tileType]) {
//         let method = req.method.toLowerCase()

//         let auth = services[tileType].no_auth === undefined || !services[tileType].no_auth.includes(method)

//         if (auth && !user) {
//             res.status(401).end()
//             return
//         }

//         const { db } = await connectToDatabase()

//         if (db) {

//             let profile = null
//             if (auth || user) {
//                 let query = { email: user.email }

//                 profile = await db
//                     .collection("profiles")
//                     .findOne(query)

//                 if (!profile) {
//                     res.status(401).end();
//                     return
//                 }
//             }

//             if (services[tileType][method]) {
//                 //Converted URL query to stringified objects, parse them here
//                 if (query._q !== undefined) {
//                     query = { ...query, ...JSON.parse(query._q) }
//                 }

//                 if (profile) {
//                     if (!Array.isArray(profile.roles)) profile.roles = []
//                     profile.roles.push('vehicle_admin')
//                 }

//                 let uid = auth ? profile._id : null

//                 let params = {
//                     uid,
//                     user: profile,
//                     company_id: profile ? profile.company_id : null,
//                     profile,
//                     db,
//                     ObjectId: (ref) => {
//                         return new ObjectId(ref)
//                     },
//                     query,
//                     tileType,
//                     tileId,
//                     body: req.body,
//                     internal: false,
//                     has_role: (roles) => {
//                         if (!Array.isArray(profile.roles)) return false
//                         if (!Array.isArray(roles)) roles = [roles]
//                         let result = false
//                         roles.forEach(role => {
//                             if (profile.roles.includes(role)) result = true
//                         })
//                         if (!result) console.log('Unauthorised', 'Requested: ' + roles.join(','), `User: ${user.email} - ${profile.roles.join(',')}`)
//                         return result
//                     }
//                 }
//                 params.audit = audit(params)
//                 params.ObjectId.isValid = ObjectId.isValid

//                 let result = await services[tileType][method](params, res)

//                 if (!result) {
//                     console.log('Invalid request', tileType, method, result)
//                     res.status(500).send({ err: 'Invalid request' });
//                 } else if (result._output) {
//                 } else if (result.err) {
//                     res.status(500).send(result);
//                 }
//                 else {
//                     res.status(200).send(result);
//                 }
//             } else {
//                 res.status(404).end()
//             }

//         } else {
//             res.status(404).end()
//         }

//     } else {
//         console.log('Service not found', tileType)
//         res.status(500).send({ err: 'Database Error' })
//     }

// }

// export default ironSession(handler)
