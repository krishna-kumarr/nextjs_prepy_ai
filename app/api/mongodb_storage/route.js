import DigestFetch from "digest-fetch"
import { connectToDatabase } from "~/utils/mongodb";

// Helper: get per-collection storage
async function getTotalUsageAcrossDatabases() {
    const { client } = await connectToDatabase()
    const adminDb = client.db().admin()
    const { databases } = await adminDb.listDatabases()

    let totalUsedMB = 0
    const dbStatsArr = []

    for (const dbInfo of databases) {
        if (!["local", "config"].includes(dbInfo.name)) {
            const db = client.db(dbInfo.name)
            const collections = await db.listCollections().toArray()

            const collStatsArr = []
            for (const coll of collections) {
                const stats = await db.command({ collStats: coll.name })
                const sizeMB = +(stats.size / (1024 ** 2)).toFixed(2)
                totalUsedMB += sizeMB
                collStatsArr.push({
                    name: coll.name,
                    count: stats.count,
                    sizeMB,
                    storageSizeMB: +(stats.storageSize / (1024 ** 2)).toFixed(2),
                    avgObjSizeKB: +(stats.avgObjSize / 1024).toFixed(2),
                })
            }

            dbStatsArr.push({
                dbName: dbInfo.name,
                collections: collStatsArr,
            })
        }
    }

    return { totalUsedMB, dbStatsArr }
}


export async function GET() {
    const projectId = process.env.MONGODB_PROJECT_ID
    const clusterName = process.env.MONGODB_CLUSTER_NAME
    const publicKey = process.env.MONGODB_PUBLIC_KEY
    const privateKey = process.env.MONGODB_PRIVATE_KEY
    const digestClient = new DigestFetch(publicKey, privateKey)

    try {
        //Get cluster info
        const clusterUrl = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/clusters/${clusterName}`
        const clusterRes = await digestClient.fetch(clusterUrl, { headers: { Accept: "application/json" } })
        if (!clusterRes.ok) throw new Error(`Cluster API error: ${clusterRes.status}`)
        const cluster = await clusterRes.json()

        //Get per-collection storage stats
        const { totalUsedMB, dbStatsArr } = await getTotalUsageAcrossDatabases()
        const totalAllocatedMB = cluster.diskSizeGB ? cluster.diskSizeGB * 1024 : 0
        const remainingMB = +(totalAllocatedMB - totalUsedMB).toFixed(2)

        //Build final response
        const response = {
            clusterId: cluster.id || null,
            clusterName: cluster.name || null,
            orgId: cluster.orgId || null,
            clusterCount: cluster.clusterCount || null,
            created: cluster.created || null,
            mongoVersion: cluster.mongoDBVersion || null,
            storageGB: cluster.diskSizeGB || null,
            provider: cluster.providerSettings?.providerName || null,
            instanceSize: cluster.providerSettings?.instanceSizeName || null,
            paused: cluster.paused || false,
            // tags: cluster.tags || [],
            // withDefaultAlertsSettings: cluster.withDefaultAlertsSettings || false,
            // links: cluster.links || [],
            totalAllocatedMB,
            totalUsedMB,
            remainingMB,
            // databases: dbStatsArr
        }

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}
