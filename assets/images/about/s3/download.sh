#!/bin/zsh
# Download all Section 3 assets from Figma MCP
DIR="/Users/kongk/LUCKKANAPro/assets/images/about/s3"
cd "$DIR"

declare -A FILES=(
  ["ellipse20.png"]="https://www.figma.com/api/mcp/asset/1e82d3ac-325f-4768-9ce1-33aaaf48531f"
  ["group1897.png"]="https://www.figma.com/api/mcp/asset/2e7c7231-bc05-496b-953d-7d232519deca"
  ["ellipse21.png"]="https://www.figma.com/api/mcp/asset/68843366-ac29-40a1-8cb3-aef65c3c853b"
  ["ellipse22.png"]="https://www.figma.com/api/mcp/asset/65633764-84c3-4563-87f0-8b3cffbc4df9"
  ["ellipse23.png"]="https://www.figma.com/api/mcp/asset/8c18e83e-39e2-40d7-8b09-26f384646264"
  ["group1907.png"]="https://www.figma.com/api/mcp/asset/aadf3af6-7826-4c50-9f22-192c224f0f42"
  ["group-icon.png"]="https://www.figma.com/api/mcp/asset/e1ecd1ad-020d-46f7-b30a-704b4e4279f4"
  ["vector-1.png"]="https://www.figma.com/api/mcp/asset/053cc37c-dd7d-4636-8705-4755abad9b10"
  ["vector-2.png"]="https://www.figma.com/api/mcp/asset/3f4d91c0-92c6-40da-bbaa-5d6283598c5b"
  ["group1-icon.png"]="https://www.figma.com/api/mcp/asset/e7d18171-bb60-4363-adc5-e35861c21126"
  ["group1900.png"]="https://www.figma.com/api/mcp/asset/492c51a2-719b-4b51-b992-61675cbbd30e"
  ["group1901.png"]="https://www.figma.com/api/mcp/asset/578dac20-02c0-42a6-b894-b857c776adc1"
  ["vector-3.png"]="https://www.figma.com/api/mcp/asset/7e1b5a7d-ea6d-4d66-b71d-f2630dd0325b"
  ["group1905.png"]="https://www.figma.com/api/mcp/asset/a1820b0c-8c07-4954-b8c2-c4422b7641d2"
  ["group1902.png"]="https://www.figma.com/api/mcp/asset/d45cd448-beac-4820-9718-5a1b06ac23b9"
  ["group1903.png"]="https://www.figma.com/api/mcp/asset/9b4ea3ec-18f5-44a9-99b0-0f2e93efeefc"
  ["group1904.png"]="https://www.figma.com/api/mcp/asset/e77dd86b-c199-43cd-a922-e8668a94058b"
  ["skill-r1.png"]="https://www.figma.com/api/mcp/asset/3549f851-4c11-42a7-a530-652ab6ba562c"
  ["skill-r3.png"]="https://www.figma.com/api/mcp/asset/7a9cf824-1c09-44e3-bff0-6c07f7422256"
  ["skill-r6.png"]="https://www.figma.com/api/mcp/asset/6055df68-1dd0-4cc3-b6c8-fca26acf7cca"
  ["skill-r7.png"]="https://www.figma.com/api/mcp/asset/d664f257-7b2b-4635-b19b-67b90d47c330"
  ["skill-r11.png"]="https://www.figma.com/api/mcp/asset/9528d383-08ad-4eac-93e5-e0030a778ca8"
  ["skill-img13.png"]="https://www.figma.com/api/mcp/asset/c3528673-4d3a-4c93-abb0-25257d518371"
  ["skill-img14.png"]="https://www.figma.com/api/mcp/asset/57aeb0c5-1fae-4785-9f13-33e14b7d1868"
  ["skill-img15.png"]="https://www.figma.com/api/mcp/asset/23b26655-0b7e-4a09-b100-eadb8fea6d60"
  ["skill-img16.png"]="https://www.figma.com/api/mcp/asset/637d8ad2-a52f-4801-b373-3827b479bc36"
  ["skill-img17.png"]="https://www.figma.com/api/mcp/asset/3fccf80d-70c6-490f-8e46-1eff09b28df4"
  ["skill-img18.png"]="https://www.figma.com/api/mcp/asset/f5555d7e-3634-4efb-8b2c-cf9f239c1738"
  ["ellipse6.png"]="https://www.figma.com/api/mcp/asset/d97757b6-045a-431b-a362-b8ced6e4c6b4"
  ["ellipse7.png"]="https://www.figma.com/api/mcp/asset/51580ea2-2788-44e8-b316-54d806ddad00"
  ["vline30.png"]="https://www.figma.com/api/mcp/asset/76c91012-e8ab-494a-9735-5d9ae9acaaa2"
  ["vline29.png"]="https://www.figma.com/api/mcp/asset/df405eed-d0e8-4db0-bc75-61d7e1ed1f14"
  ["vline27.png"]="https://www.figma.com/api/mcp/asset/ad848ba8-3db3-49db-bc4c-f7e92d84cfde"
  ["vline26.png"]="https://www.figma.com/api/mcp/asset/6a595491-02ae-439f-a343-02bd7a47f082"
)

for fname in "${(@k)FILES}"; do
  url="${FILES[$fname]}"
  echo -n "  $fname ... "
  curl -sL "$url" -o "$fname" && echo "OK" || echo "FAIL"
done

echo ""
echo "Done. Files:"
ls -lh "$DIR" | tail -n +2
