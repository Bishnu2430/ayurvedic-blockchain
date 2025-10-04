# Soil-to-Shelf — Blockchain-Powered Traceability Platform for Ayurveda

> Blockchain-based traceability of Ayurvedic herbs from collection (farmers / wild collectors) to the product label (consumer), with geo-tagging, smart contracts, QR-based consumer transparency, and an offline-first farmer DApp.
> (Based on the uploaded project slides.) 

---

## Table of contents

* [Project overview](#project-overview)
* [Motivation & impact](#motivation--impact)
* [Key features](#key-features)
* [Technical architecture & stack](#technical-architecture--stack)
* [Core smart-contracts / chaincode](#core-smart-contracts--chaincode)
* [REST API (example endpoints)](#rest-api-example-endpoints)
* [Data model (high-level)](#data-model-high-level)
* [Security & privacy considerations](#security--privacy-considerations)
* [Risks, mitigations & operational notes](#risks-mitigations--operational-notes)
* [Future improvements / roadmap](#future-improvements--roadmap)
* [References](#references)
* [Contributors](#contributors)

---

# Project overview

**Soil-to-Shelf** is a "permissioned" blockchain traceability platform designed to record immutable, geo-tagged collection events for Ayurvedic herbs and track the herb lifecycle through labs, processors and finally onto consumer products via QR codes. The platform aims to solve adulteration, provenance loss, and sustainability issues by providing verifiable on-chain events and consumer-facing transparency. 

---

# Motivation & impact

* Reduce mislabeling and adulteration through immutable provenance.
* Provide consumers with traceable, verifiable herb origin via QR codes.
* Enable regulators (AYUSH, government bodies) and exporters to audit supply chains easily.
* Empower farmers with fair compensation, recognition, and digital records. 

---

# Key features

* Geo-tagged `CollectionEvent` recorded at harvest (GPS + timestamp).
* Permissioned ledger using Hyperledger Fabric for confidentiality and scalability.
* Smart contracts enforcing rules (geo-fencing, seasonal restrictions, quality rules).
* Hybrid on-chain/off-chain storage (metadata, images, and large files off-chain).
* QR code mapping a product to its herb batch and interactive consumer portal.
* Offline-first mobile DApp for collectors that syncs when connectivity returns.
* Auditable timeline & interactive map for consumer/regulator use. 

---

# Technical architecture & stack

* **Blockchain:** Hyperledger Fabric (v2.5.x) — permissioned network, private channels, CouchDB state DB.
* **Chaincode (smart contracts):** Node.js chaincode (e.g., `herb-contract.js`).
* **Backend / API:** Node.js + Express using Fabric Node SDK (RESTful APIs).
* **Database:** PostgreSQL for off-chain relational data (users, QR mappings, logs).
* **Frontend:** React — consumer portal, dashboards, lab/manufacturer UIs.
* **Mobile DApp:** Offline-first mobile app (React Native / PWA) for farmers/collectors to capture GPS + images.
* **Containerization:** Docker & Docker Compose for dev/test Fabric networks and services. 

---

# Core smart-contracts / chaincode

(Representative function names & responsibilities — implement in `herb-contract.js`)

* `recordCollection(collectionEvent)`

  * Inputs: herbId / batchId, GPS coords, timestamp, collectorId, species, initial quality indicators, images (off-chain).
  * Action: creates a `CollectionEvent` on-chain and links composite key to `herbId`. Enforces geo-fencing & seasonal checks.

* `addQualityTest(herbId, testData)`

  * Inputs: labId, test results (e.g., purity, contaminants), certificate reference (off-chain).
  * Action: appends `QualityTest` event, updates latest status.

* `addProcessingStep(herbId, processingData)`

  * Inputs: processorId, step description, timestamp, batch changes.
  * Action: appends `ProcessingStep` event to the herb journey.

* `getHerbJourney(herbId)`

  * Returns the full history of composite-key events for a linked herb batch (CollectionEvent → QualityTest → ProcessingStep → Packaging).

These were described in the slides; adapt function signatures to your domain model when coding. 

---

# REST API (example endpoints)

A minimal set of APIs the backend should expose (implement with Express + Fabric SDK):

* `POST /api/fabric/collect`

  * Create a collection event. Accepts JSON body with GPS, species, collectorId, images (stored off-chain), and returns a transaction ID.

* `GET /api/fabric/herb/:herbId`

  * Returns the herb journey (history) and aggregated metadata for consumer/ dashboard display.

* `POST /api/fabric/quality`

  * Submit lab test results for a herb batch.

* `POST /api/qr/generate`

  * Generate & register a QR code mapping to a specific `herbId` or product batch.

> Example endpoints mentioned in the slides include `/api/fabric/collect` and `/api/fabric/herb/:herbId`. Add auth (JWT / mTLS) for protection. 

---

# Data model (high-level)

* **HerbBatch (herbId)**

  * `herbId` (string) — composite key (eg. region:species:batchno)
  * `owner` / `collectorId`
  * `createdAt` / `timestamps`

* **CollectionEvent**

  * `eventId`, `herbId`, `gps` (lat, long), `timestamp`, `species`, `quantity`, `images_ref` (off-chain), `collector_signature`

* **QualityTest**

  * `testId`, `herbId`, `labId`, `results` (structured JSON), `certificate_ref`

* **ProcessingStep**

  * `stepId`, `herbId`, `processorId`, `description`, `timestamp`

* **QRMapping**

  * `qrId`, `productId`, `herbId`, `productBatch`, `linkUrl`

Store large binary assets (images, certificates) off-chain (S3, IPFS, or on-prem object store) and persist references/hashes on-chain for tamper evidence.

---

# How it works — workflow

1. **Collector (farmer/wild collector)** uses mobile DApp to create a `CollectionEvent`. The DApp captures GPS, timestamp, species, photos, and optional tests; stores images off-chain and writes a blockchain tx via the backend when online (or queues & syncs when offline).
2. **Lab** adds `QualityTest` events after analysis. Labs upload test certificates to off-chain store and reference them in the chaincode call.
3. **Processor / Manufacturer** adds `ProcessingStep` events (washing, drying, batching).
4. **Packaging** generates a QR code that maps to a `product` page showing the full herb journey (interactive map + event timeline + quality certs).
5. **Consumer** scans QR and views the verified chain of custody & sustainability indicators. 

---

# Security & privacy considerations

* **Immutability is permanent:** incorrect on-chain data is hard to change — add procedures for corrections (e.g., append correction events rather than attempting deletion).
* **Authentication & authorization:** require mTLS for Fabric peers and JWT/OAuth for REST APIs. RBAC for lab/processor actions.
* **Data sensitivity:** personal data (collector contact) should be minimized on-chain or stored encrypted with access control off-chain.
* **Offline DApp syncing:** implement strong signing of events by collectors to prevent spoofing.
* **Geo-privacy:** store coarse/hashed location data if strict privacy rules apply, or only provide precise GPS to authorized auditors. 

---

# Risks, mitigations & operational notes

* **Adoption resistance:** mitigate via training, incentives, and local pilots.
* **Wrong input data:** use validation in DApp and smart contracts; keep an audit trail for corrections.
* **Connectivity issues in rural areas:** offline-first DApp with secure local queuing and integrity checks.
* **Scaling costs:** phased rollout and use of permissioned network to control node count. Solutions & mitigations described in the slides. 

---

# Future improvements / roadmap

* Integrate IoT sensors (soil moisture, temp) and store hashed sensor summaries on-chain.
* Advanced analytics: ML models to predict adulteration risk and recommend fair pricing to farmers.
* Interoperability: FHIR-style metadata for healthcare and export compliance tooling.
* Tokenization / incentives: micropayments or reputation tokens for verified high-quality collectors. 

---

# References (selected from the slide deck)

* Walmart Case Study: Hyperledger Fabric for Food Supply Chain. 
* HerBChain — blockchain for herbal quality assurance (2021). 
* Selected academic & industry papers (2024–2025) referenced on the slides. 

---

# Contributors

* Team Name (Registered on portal): **CREATIVE CARTEL** (Team ID: 100746) — details from slides. 

---

# Suggested repo structure

```
/
├─ fabric-network/            # scripts & docker-compose for Fabric test network
├─ chaincode/                 # Node.js chaincode (herb-contract.js)
├─ backend/                   # Express + Fabric SDK + REST APIs
├─ frontend/                  # React apps (consumer portal + dashboards)
├─ mobile-dapp/               # PWA or React Native mobile DApp for collectors
├─ docs/                      # design docs, sequence diagrams, slides
├─ infra/                     # k8s manifests, terraform (optional)
├─ scripts/                   # helper scripts: wallet management, enroll users
├─ README.md
└─ LICENSE
```

