#!/usr/bin/env python3
"""
Track Visual Asset Pipeline
============================
Takes images/videos for music tracks and generates:
  1. Key frames (from video, or copies image)
  2. Depth maps (via Depth Anything V2 / MiDaS)
  3. Resized web-optimized versions
  4. manifest.json with metadata

Usage:
  python scripts/process_track_visuals.py --input path/to/video_or_image \
    --artist synthetic-souls --track binary-lullaby \
    [--fps 2] [--size 1024] [--depth-model small]

Output: public/visuals/{artist}/{track}/
  ├── frames/001.webp ... NNN.webp
  ├── depth/001.webp ... NNN.webp
  ├── cover.webp          (first frame, optimized)
  └── manifest.json
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

# ─── Constants ──────────────────────────────────────────────
DEPTH_MODELS = {
    "small": "LiheYoung/depth-anything-v2-small",
    "base": "LiheYoung/depth-anything-v2-base",
}
DEFAULT_SIZE = 1024  # Max dimension for output frames
DEFAULT_FPS = 2      # Frames per second for video extraction
WEBP_QUALITY = 85

# ─── Frame extraction ──────────────────────────────────────

def is_video(path: str) -> bool:
    ext = Path(path).suffix.lower()
    return ext in {".mp4", ".mov", ".avi", ".webm", ".mkv", ".gif"}


def extract_frames(input_path: str, output_dir: str, fps: int, max_size: int) -> list[str]:
    """Extract frames from video using ffmpeg, or copy image."""
    os.makedirs(output_dir, exist_ok=True)
    frames = []

    if is_video(input_path):
        # Extract at target FPS, scale to max dimension, output as PNG (lossless intermediate)
        scale_filter = f"scale='min({max_size},iw)':min'({max_size},ih)':force_original_aspect_ratio=decrease"
        cmd = [
            "ffmpeg", "-y", "-i", input_path,
            "-vf", f"fps={fps},scale=w='min({max_size},iw)':h='min({max_size},ih)':force_original_aspect_ratio=decrease",
            "-q:v", "2",
            os.path.join(output_dir, "%03d.png"),
        ]
        print(f"  Extracting frames at {fps} fps...")
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"  ffmpeg error: {result.stderr[:300]}")
            sys.exit(1)

        frames = sorted(Path(output_dir).glob("*.png"))
        print(f"  Extracted {len(frames)} frames")
    else:
        # Single image — copy as frame 001
        from PIL import Image
        img = Image.open(input_path).convert("RGB")
        # Resize to max dimension
        w, h = img.size
        if max(w, h) > max_size:
            ratio = max_size / max(w, h)
            img = img.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)
        out = os.path.join(output_dir, "001.png")
        img.save(out)
        frames = [Path(out)]
        print(f"  Processed 1 image ({img.size[0]}x{img.size[1]})")

    return [str(f) for f in frames]


# ─── Depth estimation ──────────────────────────────────────

_depth_pipe = None

def get_depth_pipeline(model_name: str):
    """Lazy-load depth estimation pipeline."""
    global _depth_pipe
    if _depth_pipe is None:
        print(f"  Loading depth model: {model_name}")
        from transformers import pipeline
        _depth_pipe = pipeline(
            "depth-estimation",
            model=model_name,
            device="cpu",  # No CUDA in this env
        )
    return _depth_pipe


def generate_depth_maps(frame_paths: list[str], output_dir: str, model_key: str) -> list[str]:
    """Generate depth maps for each frame using Depth Anything V2."""
    os.makedirs(output_dir, exist_ok=True)
    model_name = DEPTH_MODELS.get(model_key, DEPTH_MODELS["small"])
    pipe = get_depth_pipeline(model_name)

    from PIL import Image
    depth_paths = []

    for i, frame_path in enumerate(frame_paths):
        img = Image.open(frame_path).convert("RGB")
        result = pipe(img)
        depth_img = result["depth"]  # PIL Image (grayscale)

        # Normalize to full 0-255 range for better displacement
        import numpy as np
        depth_arr = np.array(depth_img, dtype=np.float32)
        if depth_arr.max() > depth_arr.min():
            depth_arr = (depth_arr - depth_arr.min()) / (depth_arr.max() - depth_arr.min()) * 255
        depth_img = Image.fromarray(depth_arr.astype(np.uint8))

        out = os.path.join(output_dir, f"{i+1:03d}.png")
        depth_img.save(out)
        depth_paths.append(out)
        print(f"  Depth {i+1}/{len(frame_paths)}: {Path(frame_path).name}")

    return depth_paths


# ─── WebP conversion ───────────────────────────────────────

def convert_to_webp(png_paths: list[str], quality: int = WEBP_QUALITY) -> list[str]:
    """Convert PNGs to WebP for smaller file sizes."""
    from PIL import Image
    webp_paths = []
    for p in png_paths:
        img = Image.open(p)
        webp_path = str(Path(p).with_suffix(".webp"))
        img.save(webp_path, "WEBP", quality=quality)
        Path(p).unlink()  # Remove PNG
        webp_paths.append(webp_path)
    return webp_paths


# ─── Manifest generation ───────────────────────────────────

def generate_manifest(
    artist: str,
    track: str,
    frame_paths: list[str],
    depth_paths: list[str],
    fps: int,
    source_is_video: bool,
) -> dict:
    """Generate manifest.json with asset metadata."""
    from PIL import Image
    first = Image.open(frame_paths[0])
    w, h = first.size

    # Relative paths from the track visuals directory
    base = Path(frame_paths[0]).parent.parent
    rel_frames = [str(Path(f).relative_to(base)) for f in frame_paths]
    rel_depths = [str(Path(d).relative_to(base)) for d in depth_paths]

    return {
        "artist": artist,
        "track": track,
        "type": "video" if source_is_video else "image",
        "width": w,
        "height": h,
        "frameCount": len(frame_paths),
        "fps": fps if source_is_video else 0,
        "durationSec": len(frame_paths) / fps if source_is_video and fps > 0 else 0,
        "frames": rel_frames,
        "depths": rel_depths,
        "cover": rel_frames[0],
    }


# ─── Main ──────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Process track visuals into 3D-ready assets")
    parser.add_argument("--input", "-i", required=True, help="Path to image or video file")
    parser.add_argument("--artist", "-a", required=True, help="Artist slug (e.g. synthetic-souls)")
    parser.add_argument("--track", "-t", required=True, help="Track slug (e.g. binary-lullaby)")
    parser.add_argument("--fps", type=int, default=DEFAULT_FPS, help=f"Frames per second for video (default: {DEFAULT_FPS})")
    parser.add_argument("--size", type=int, default=DEFAULT_SIZE, help=f"Max dimension in pixels (default: {DEFAULT_SIZE})")
    parser.add_argument("--depth-model", choices=list(DEPTH_MODELS.keys()), default="small", help="Depth model size")
    parser.add_argument("--skip-depth", action="store_true", help="Skip depth map generation")
    parser.add_argument("--output-dir", default=None, help="Override output directory")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: Input file not found: {args.input}")
        sys.exit(1)

    # Output directory
    if args.output_dir:
        out_dir = args.output_dir
    else:
        out_dir = os.path.join("public", "visuals", args.artist, args.track)

    frames_dir = os.path.join(out_dir, "frames")
    depth_dir = os.path.join(out_dir, "depth")

    print(f"\n{'='*60}")
    print(f"  Track Visual Pipeline")
    print(f"  Input:  {args.input}")
    print(f"  Output: {out_dir}")
    print(f"  Model:  {args.depth_model}")
    print(f"{'='*60}\n")

    # Step 1: Extract frames
    print("[1/3] Extracting frames...")
    frame_paths = extract_frames(args.input, frames_dir, args.fps, args.size)

    # Step 2: Generate depth maps
    if args.skip_depth:
        print("[2/3] Skipping depth maps")
        depth_paths = []
    else:
        print("[2/3] Generating depth maps...")
        depth_paths = generate_depth_maps(frame_paths, depth_dir, args.depth_model)

    # Step 3: Convert to WebP
    print("[3/3] Converting to WebP...")
    frame_paths = convert_to_webp(frame_paths)
    if depth_paths:
        depth_paths = convert_to_webp(depth_paths, quality=90)

    # Generate cover (copy first frame)
    import shutil
    cover_path = os.path.join(out_dir, "cover.webp")
    if frame_paths:
        shutil.copy2(frame_paths[0], cover_path)

    # Write manifest
    manifest = generate_manifest(
        args.artist, args.track,
        frame_paths, depth_paths,
        args.fps, is_video(args.input),
    )
    manifest_path = os.path.join(out_dir, "manifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\n  Done! Assets at: {out_dir}")
    print(f"  Frames: {len(frame_paths)}, Depths: {len(depth_paths)}")
    print(f"  Manifest: {manifest_path}\n")


if __name__ == "__main__":
    main()
