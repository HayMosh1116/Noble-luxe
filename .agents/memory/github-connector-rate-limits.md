---
name: GitHub connector uploads
description: Practical constraint for pushing larger repository updates through the connected GitHub API.
---

Pace GitHub REST blob uploads below the connector's 10-requests-per-second limit, and compare local Git blob hashes against the remote tree before uploading.

**Why:** Bulk parallel blob creation can be throttled even when the connection is healthy, while imported repositories often contain many unchanged files.

**How to apply:** Read the remote branch tree first, upload only changed blobs sequentially or with conservative pacing, then create one tree, commit, and fast-forward the branch.