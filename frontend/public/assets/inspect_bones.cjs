// Quick bone inspector - run this as a standalone script to list all bones in a GLB
const fs = require('fs');
const path = require('path');

// Read the GLB file
const glbPath = path.join(__dirname, 'Soldier.glb');
const buf = fs.readFileSync(glbPath);

// Parse GLB header
const magic = buf.readUInt32LE(0);
const version = buf.readUInt32LE(4);
console.log(`GLB Magic: ${magic.toString(16)}, Version: ${version}`);

// Read JSON chunk
const jsonLength = buf.readUInt32LE(12);
const jsonType = buf.readUInt32LE(16);
const jsonStr = buf.slice(20, 20 + jsonLength).toString('utf8');

const gltf = JSON.parse(jsonStr);

// List all node names (bones)
if (gltf.nodes) {
  console.log('\n=== All Nodes/Bones ===');
  gltf.nodes.forEach((node, idx) => {
    if (node.name) {
      const hasChildren = node.children && node.children.length > 0;
      console.log(`[${idx}] ${node.name} ${hasChildren ? `-> children: [${node.children.join(',')}]` : ''}`);
    }
  });
}

// List skins
if (gltf.skins) {
  console.log('\n=== Skins ===');
  gltf.skins.forEach((skin, idx) => {
    console.log(`Skin ${idx}: ${skin.name}, joints: ${skin.joints?.length}`);
    if (skin.joints) {
      skin.joints.forEach((jointIdx) => {
        const node = gltf.nodes[jointIdx];
        if (node) console.log(`  Joint: ${node.name}`);
      });
    }
  });
}
