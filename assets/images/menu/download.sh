#!/bin/bash
DIR="/Users/kongk/LUCKKANAPro/assets/images/menu"
cd "$DIR"
curl -sL "https://www.figma.com/api/mcp/asset/aafd4a40-184d-49db-a7ad-3717e5f8c342" -o hand-left-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/70a4fc25-081c-49d8-a4ac-f2fdf1df7c59" -o hand-right-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/354f47a3-dd63-45e6-8e3f-f7d4cd6dc21a" -o crystal-ball.png
curl -sL "https://www.figma.com/api/mcp/asset/ae5ca4ec-cd00-48c3-9665-3c7f583fc287" -o simsy-stick-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/c350fe7b-5310-40ef-b7e9-70508fd27686" -o zodiac-shape-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/ef0828f8-bf49-4f37-a04b-a3af9e8e26de" -o vector-chinese-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/395b53e7-5cdf-4c2f-bb9a-6ae8615bb707" -o subtract-a-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/23589932-f1d9-456c-a8ba-318788362f47" -o subtract-b-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/5446c473-57b6-431e-a085-4459f2c89f28" -o subtract-c-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/ae2d24e4-4110-4d34-9bb0-1ea2a370a6c5" -o star-large-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/555c9c25-d0c4-4d26-a535-e07c6eaf5621" -o star-medium-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/f7691d45-e9ec-4861-b11c-de2db44b132e" -o star-small-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/63b8363b-4e86-48bc-8836-d9f2fd023cb7" -o btn-circle-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/79c9883f-6588-42f2-b3c1-b8749ccd36dc" -o btn-arrow-figma.png
curl -sL "https://www.figma.com/api/mcp/asset/8d01103a-212c-41d1-b967-79ae06a5b0d2" -o stick-star-figma.png
echo "All done"
ls -la *.png
