"use client";

import { useEffect } from "react";

export default function Database_page() {
    function safeFixed(val, digits = 2) {
        if (val === null || val === undefined || isNaN(val)) return "0.00";
        return Number(val).toFixed(digits);
    }

    function formatMB(mb) {
        if (!mb || isNaN(mb)) return "0.00 MB";
        return mb >= 1024
            ? (mb / 1024).toFixed(2) + " GB"
            : mb.toFixed(2) + " MB";
    }

    async function loadMongoStats() {
        const res = await fetch("/api/mongodb_storage");
        const data = await res.json();

        /* ------------------------
         * CLUSTER INFO
         * ------------------------ */
        const clusterCards = document.getElementById("clusterCards");

        clusterCards.innerHTML = `
            <div class="col-md-3">
                <div class="card shadow-sm border-0 p-3">
                    <h6 class="text-muted small mb-1">Cluster Name</h6>
                    <h5>${data.clusterName || "N/A"}</h5>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card shadow-sm border-0 p-3">
                    <h6 class="text-muted small mb-1">Provider</h6>
                    <span class="badge bg-primary px-3 py-2">${data.provider}</span>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card shadow-sm border-0 p-3">
                    <h6 class="text-muted small mb-1">Instance</h6>
                    <span class="badge bg-dark px-3 py-2">${data.instanceSize}</span>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card shadow-sm border-0 p-3">
                    <h6 class="text-muted small mb-1">Mongo Version</h6>
                    <span class="badge bg-success px-3 py-2">${data.mongoVersion}</span>
                </div>
            </div>
        `;

        /* ------------------------
         * GAUGE CIRCLE
         * ------------------------ */
        const percent = (data.totalUsedMB / data.totalAllocatedMB) * 100 || 0;
        const deg = (percent / 100) * 360;

        const gauge = document.getElementById("storageGauge");
        if (gauge) gauge.style.setProperty("--percent", deg + "deg");

        document.getElementById("gaugeText").innerHTML =
            `<span>${safeFixed(percent, 1)}%</span>`;

        document.getElementById("storageDetails").innerHTML = `
            <div class="row text-center mt-3">
                <div class="col-md-4">
                    <div class="card p-3 shadow-sm border-0">
                        <h6 class="text-muted small">Allocated</h6>
                        <h5>${formatMB(data.totalAllocatedMB)}</h5>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-3 shadow-sm border-0">
                        <h6 class="text-muted small">Used</h6>
                        <h5 class="text-danger">${formatMB(data.totalUsedMB)}</h5>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card p-3 shadow-sm border-0">
                        <h6 class="text-muted small">Remaining</h6>
                        <h5 class="text-success">${formatMB(data.remainingMB)}</h5>
                    </div>
                </div>
            </div>
        `;

        /* ------------------------
         * DATABASE CARDS
         * ------------------------ */
        const dbCards = document.getElementById("dbCards");

        dbCards.innerHTML = data.databases
            .map((db) => {
                const dbUsed = db.collections.reduce(
                    (t, c) => t + (c.sizeMB || 0),
                    0
                );

                return `
                <div class="col-12 col-md-4">
                    <div class="card shadow-sm border-0 p-3 h-100">
                        <h5 class="mb-1">${db.dbName}</h5>
                        <small class="text-muted">${db.collections.length} collections</small>

                        <div class="mt-3 p-2 bg-light rounded">
                            <strong>Total Used:</strong> ${formatMB(dbUsed)}
                        </div>

                        <div class="mt-3">
                            ${db.collections
                                .slice(0, 4)
                                .map(
                                    (c) => `
                                <div class="d-flex justify-content-between small py-1 border-bottom">
                                    <span>${c.name}</span>
                                    <span>${safeFixed(c.sizeMB)} MB</span>
                                </div>`
                                )
                                .join("")}

                            ${
                                db.collections.length > 4
                                    ? `<div class="text-muted small text-end mt-1">+ ${
                                          db.collections.length - 4
                                      } more</div>`
                                    : ""
                            }
                        </div>
                    </div>
                </div>`;
            })
            .join("");

        /* ------------------------
         * TABLE
         * ------------------------ */
        const tableBody = document.querySelector("#dbTable tbody");

        tableBody.innerHTML = data.databases
            .flatMap((db) =>
                db.collections.map(
                    (c) => `
                <tr>
                    <td>${db.dbName}</td>
                    <td>${c.name}</td>
                    <td>${c.count ?? 0}</td>
                    <td>${safeFixed(c.sizeMB)}</td>
                    <td>${safeFixed(c.storageSizeMB)}</td>
                    <td>${safeFixed(c.avgObjSizeKB)}</td>
                </tr>`
                )
            )
            .join("");
    }

    useEffect(() => {
        loadMongoStats();
    }, []);

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4">MongoDB Cluster Dashboard</h3>

            {/* ---- TOP CARDS ---- */}
            <div id="clusterCards" className="row g-3 mb-4"></div>

            {/* ---- GAUGE ---- */}
            <div className="card p-4 shadow-sm mb-4 border-0">
                <h5 className="fw-bold mb-3 text-center">Storage Usage</h5>
                <div className="d-flex justify-content-center">
                    <div className="gauge" id="storageGauge" style={{ "--percent": "0deg" }}>
                        <div className="gauge-inner" id="gaugeText">
                            <span>0%</span>
                        </div>
                    </div>
                </div>

                <div id="storageDetails" className="mt-4"></div>
            </div>

            {/* ---- DATABASE CARDS ---- */}
            <h4 className="fw-bold mt-4">Database Breakdown</h4>
            <div id="dbCards" className="row g-4 mt-1"></div>

            {/* ---- FULL TABLE ---- */}
            <h4 className="fw-bold mt-5 mb-3">All Collections</h4>
            <div className="table-responsive shadow-sm">
                <table className="table table-bordered table-striped" id="dbTable">
                    <thead className="table-dark">
                        <tr>
                            <th>Database</th>
                            <th>Collection</th>
                            <th>No of Records</th>
                            <th>Size (MB)</th>
                            <th>Storage (MB)</th>
                            <th>Avg Obj (KB)</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    );
}
