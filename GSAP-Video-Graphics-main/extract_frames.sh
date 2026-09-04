#!/bin/bash

# Check if the video file and output directory are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <video_file> <output_directory>"
    exit 1
fi

VIDEO_FILE=$1
OUTPUT_DIR=$2

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Extract frames and save as compressed JPEG images
ffmpeg -i "$VIDEO_FILE" -q:v 2 "$OUTPUT_DIR/frame_%04d.jpg"

echo "Frames extracted to $OUTPUT_DIR"