#!/usr/bin/env bash
# Download Phase A Higgsfield assets and transcode to web formats.
# Idempotent: re-running skips files that already exist.

set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p public/media
cd public/media

CDN="https://d8j0ntlcm91z4.cloudfront.net/user_39NRMZdHaPkQW5jWeZlbKtKzopQ"

# Map: target_name <- source_url
declare -a JOBS=(
  # 5 service icon loops (wan2_6 mp4)
  "svc-01.mp4|$CDN/hf_20260525_054229_8ca6b2cf-0d44-44b5-b479-29c567d74023.mp4"
  "svc-02.mp4|$CDN/hf_20260525_054237_b9e9e268-349a-4db7-994f-fcf23199a1ab.mp4"
  "svc-03.mp4|$CDN/hf_20260525_054245_a73f9046-4b36-4cb0-97b0-b9625e539526.mp4"
  "svc-04.mp4|$CDN/hf_20260525_054253_81596fd8-23a6-44ff-b6fb-ecb83d4b1218.mp4"
  "svc-05.mp4|$CDN/hf_20260525_054303_82a243d7-adec-4ef9-ac4d-1826203d0b35.mp4"
  # hero (veo3_1 ultra)
  "hero.mp4|$CDN/hf_20260525_054145_0138d531-733a-4111-869d-3a7c8010aafe.mp4"
  # contact (kling3_0)
  "contact.mp4|$CDN/hf_20260525_054138_e91ef5c1-34d3-4e50-a7a1-ffc8d9fec15a.mp4"
  # process (seedance1_5)
  "process.mp4|$CDN/hf_20260525_054131_e980059a-6653-43ab-8980-61d6c5be0ed0.mp4"
  # 3 work covers (soul_cinematic PNG — webp via minUrl)
  "work-01-src.webp|$CDN/hf_20260525_053922_1c275c0e-6750-4193-95b0-ba02ca3f85d1_min.webp"
  "work-02-src.webp|$CDN/hf_20260525_053957_5d23c4a4-7d60-4596-bfc3-faa4c8fe91ee_min.webp"
  "work-03-src.webp|$CDN/hf_20260525_054004_de8e7849-609a-4739-b23f-331a90e6be10_min.webp"
  # 15 industry presets (nano_banana_2 4k, take primary 3 per industry via minUrl webp)
  "ind-banking-01.webp|$CDN/hf_20260525_054013_8c61ac22-c9dd-427a-927c-c6c375b5dc96_min.webp"
  "ind-banking-02.webp|$CDN/hf_20260525_054013_e8bde957-6886-46da-8005-db5aa869095d_min.webp"
  "ind-banking-03.webp|$CDN/hf_20260525_054013_d02376f9-5123-4338-9d2f-0fd8391b97b3_min.webp"
  "ind-retail-01.webp|$CDN/hf_20260525_054028_7df19017-e89f-4731-98cc-998e7c7bf853_min.webp"
  "ind-retail-02.webp|$CDN/hf_20260525_054028_9e4c6a20-98ec-46bc-a362-d7616d63dfa1_min.webp"
  "ind-retail-03.webp|$CDN/hf_20260525_054028_2208b010-2291-46f0-8b04-fa3f27b70ad0_min.webp"
  "ind-telecom-01.webp|$CDN/hf_20260525_054042_13ffb55c-7415-452f-a2d1-741d1fa9ec36_min.webp"
  "ind-telecom-02.webp|$CDN/hf_20260525_054042_784bac0a-e5f5-452e-86ec-4b808d7336f5_min.webp"
  "ind-telecom-03.webp|$CDN/hf_20260525_054042_6b778589-9d8e-4c0e-b696-5bd8e4cf03e3_min.webp"
  "ind-fmcg-01.webp|$CDN/hf_20260525_054058_04190f58-266a-47e7-b7b2-eee84d83ec76_min.webp"
  "ind-fmcg-02.webp|$CDN/hf_20260525_054058_e6f7a5e8-b248-46fd-b781-ab4acc402642_min.webp"
  "ind-fmcg-03.webp|$CDN/hf_20260525_054058_bea466fa-3f9c-4a4e-84c4-05fad2d1064f_min.webp"
  "ind-gov-01.webp|$CDN/hf_20260525_054112_cecbb555-f092-4b14-9959-7d72847e1cc5_min.webp"
  "ind-gov-02.webp|$CDN/hf_20260525_054112_4f96e138-a0a1-4274-a3bb-0678f72026fe_min.webp"
  "ind-gov-03.webp|$CDN/hf_20260525_054113_c95ea34b-0583-4ff7-8ae9-1645d3395b27_min.webp"
)

echo "==> Downloading sources"
for job in "${JOBS[@]}"; do
  name="${job%%|*}"
  url="${job#*|}"
  if [[ -f "$name" ]]; then
    echo "  skip $name (exists)"
  else
    echo "  get  $name"
    curl -fsSL --max-time 300 "$url" -o "$name"
  fi
done

echo "==> Transcode svc-*.mp4 -> webm (vp9, no audio)"
for i in 01 02 03 04 05; do
  if [[ ! -f "svc-${i}.webm" ]]; then
    ffmpeg -y -i "svc-${i}.mp4" -c:v libvpx-vp9 -b:v 0 -crf 33 -an -loglevel error "svc-${i}.webm"
  fi
done

echo "==> Generate webm fallbacks for hero / process / contact"
for name in hero process contact; do
  if [[ ! -f "${name}.webm" ]]; then
    ffmpeg -y -i "${name}.mp4" -c:v libvpx-vp9 -b:v 0 -crf 32 -an -loglevel error "${name}.webm"
  fi
done

echo "==> Rename work-XX-src.webp -> work-XX.webp (already webp from Higgsfield minUrl)"
for i in 01 02 03; do
  if [[ ! -f "work-${i}.webp" && -f "work-${i}-src.webp" ]]; then
    mv "work-${i}-src.webp" "work-${i}.webp"
  fi
done

echo "==> Inventory"
ls -lah | grep -E '\.(mp4|webm|webp)$' | awk '{printf "  %10s  %s\n", $5, $9}'
echo
echo "==> Total"
du -sh .
