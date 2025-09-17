#!/bin/bash

echo "=== Ayurvedic Blockchain Environment Check ==="
echo

# Check system
echo "🖥️  System: $(lsb_release -d | cut -f2)"
echo "💾 Available Space: $(df -h ~ | awk 'NR==2 {print $4}')"
echo

# Check Docker
echo "🐳 Docker:"
docker --version
echo "   Running containers: $(docker ps -q | wc -l)"
echo

# Check Node.js
echo "🟢 Node.js:"
node --version
npm --version
echo

# Check Go
echo "🔵 Go:"
go version
echo

# Check Fabric
echo "⛓️  Hyperledger Fabric:"
peer version --short 2>/dev/null || echo "   ❌ Peer not found in PATH"
echo

# Check PostgreSQL
echo "🐘 PostgreSQL:"
psql --version
pg_isready -q && echo "   ✅ PostgreSQL is running" || echo "   ❌ PostgreSQL not running"
echo

# Check Fabric Network
echo "🌐 Fabric Test Network:"
cd ~/ayurvedic-blockchain/fabric-samples/test-network
if [ -f "network.sh" ]; then
    running_containers=$(docker ps -q --filter "label=service=hyperledger-fabric" | wc -l)
    echo "   Running Fabric containers: $running_containers"
    if [ $running_containers -gt 0 ]; then
        echo "   ✅ Fabric network is running"
    else
        echo "   ⚠️  Fabric network not running (run ./network.sh up createChannel -ca -s couchdb)"
    fi
else
    echo "   ❌ Fabric samples not found"
fi

echo
echo "=== Environment Check Complete ==="
