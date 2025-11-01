"""
Flask web application for video editing frontend.
Allows users to upload videos, select transcript highlights, and process videos.
"""

import os
import json
import tempfile
from pathlib import Path
from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from werkzeug.utils import secure_filename
from video_overlay_script import (
    ProjectConfig,
    HighlightAssignment,
    build_transcript,
    render_project,
)

# Vercel will serve the React build, so Flask only needs to be an API.
app = Flask(__name__)

app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'outputs'

# Create necessary folders
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)
os.makedirs('clips', exist_ok=True)
os.makedirs('audio_files', exist_ok=True)


def render_project_with_transcript(config: ProjectConfig, transcript: list):
    """
    Render project using an existing transcript instead of regenerating it.
    This avoids calling Whisper again which is slow and unnecessary.
    """
    from video_overlay_script import (
        map_assignments_to_segments,
        process_video_with_overlays,
        merge_audio_tracks,
        generate_default_subtitle_segments,
        HAVE_MOVIEPY
    )

    # Use the provided transcript instead of calling build_transcript
    highlight_segments = map_assignments_to_segments(
        transcript, config.highlight_assignments
    )

    any_segment_music = any(
        assignment.music_path for assignment in config.highlight_assignments
    )
    needs_audio_merge = HAVE_MOVIEPY and (
        config.preserve_audio or bool(config.global_music_path) or any_segment_music
    )
    final_output_path = config.output_path
    silent_output_path = final_output_path

    # Generate subtitle segments
    subtitle_segments = config.subtitle_segments
    if subtitle_segments is None:
        subtitle_segments = generate_default_subtitle_segments(
            transcript, highlight_segments
        )

    if needs_audio_merge:
        root, ext = os.path.splitext(final_output_path)
        ext = ext or ".mp4"
        silent_output_path = f"{root}.silent{ext}"

    # Render video with overlays
    process_video_with_overlays(
        config.main_video_path,
        transcript,
        highlight_segments,
        config.subtitle_design,
        silent_output_path,
        subtitle_segments=subtitle_segments,
        custom_subtitles=None,
    )

    # Merge audio if needed
    if needs_audio_merge:
        merge_audio_tracks(
            silent_output_path,
            config.main_video_path,
            transcript,
            highlight_segments,
            final_output_path,
            preserve_main_audio=config.preserve_audio,
            global_music_path=config.global_music_path,
            global_music_volume=config.global_music_volume,
        )

        if os.path.exists(silent_output_path) and silent_output_path != final_output_path:
            os.remove(silent_output_path)

    return {
        "output_path": final_output_path,
        "transcript": transcript,
        "highlight_segments": highlight_segments,
    }

ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}
ALLOWED_AUDIO_EXTENSIONS = {'mp3', 'wav', 'aac', 'm4a'}


def allowed_file(filename, allowed_extensions):
    """Check if file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


# The root route is handled by Vercel serving the React app's index.html.
# This route is no longer needed in Flask.


@app.route('/test-route')
def test_route():
    """Test route to verify server is responding."""
    return jsonify({'message': 'Server is working!', 'routes': ['upload-video', 'upload-video-with-txt']})


@app.route('/upload-video', methods=['POST'])
def upload_video():
    """Handle main video upload and generate transcript."""
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename, ALLOWED_VIDEO_EXTENSIONS):
        return jsonify({'error': 'Invalid file type. Please upload a video file.'}), 400

    try:
        # Save the uploaded video
        filename = secure_filename(file.filename)
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(video_path)

        # Generate transcript using Whisper
        whisper_model = request.form.get('whisper_model', 'base')
        transcript = build_transcript(video_path, None, whisper_model)

        # Extract just the words for display
        words = [entry['word'] for entry in transcript]
        full_text = ' '.join(words)

        return jsonify({
            'success': True,
            'video_path': video_path,
            'transcript': transcript,
            'full_text': full_text,
            'word_count': len(words)
        })

    except Exception as e:
        return jsonify({'error': f'Error processing video: {str(e)}'}), 500


@app.route('/upload-video-with-txt', methods=['POST'])
def upload_video_with_txt():
    """Handle video upload with TXT transcript file."""
    print("[DEBUG] ========== UPLOAD VIDEO WITH TXT CALLED ==========")
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    if 'transcript_file' not in request.files:
        return jsonify({'error': 'No transcript file provided'}), 400

    video_file = request.files['video']
    txt_file = request.files['transcript_file']

    if video_file.filename == '' or txt_file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(video_file.filename, ALLOWED_VIDEO_EXTENSIONS):
        return jsonify({'error': 'Invalid video file type'}), 400

    if not txt_file.filename.endswith('.txt'):
        return jsonify({'error': 'Transcript must be a .txt file'}), 400

    try:
        # Save the uploaded video
        video_filename = secure_filename(video_file.filename)
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_filename)
        video_file.save(video_path)
        print(f"[DEBUG] Video saved to: {video_path}")

        # Read the transcript text and split by lines
        transcript_text = txt_file.read().decode('utf-8')
        print(f"[DEBUG] Transcript text length: {len(transcript_text)}")
        lines = [line.strip() for line in transcript_text.split('\n') if line.strip()]
        print(f"[DEBUG] Found {len(lines)} lines in transcript")

        # Generate transcript with evenly spaced timing
        from video_overlay_script import probe_video_metadata, evenly_spaced_transcript
        _, _, _, _, duration = probe_video_metadata(video_path)
        print(f"[DEBUG] Video duration: {duration} seconds")

        # Create full text from all lines
        full_text = ' '.join(lines)
        print(f"[DEBUG] Full text: {full_text[:100]}...")
        transcript = evenly_spaced_transcript(full_text, duration)
        print(f"[DEBUG] Generated transcript with {len(transcript)} words")

        # Extract just the words for display
        words = [entry['word'] for entry in transcript]

        # Calculate subtitle boxes based on line breaks
        subtitles = []
        word_index = 0
        for line in lines:
            line_words = line.split()
            word_count = len(line_words)
            if word_count > 0:
                subtitles.append({
                    'text': line,
                    'start_word': word_index,
                    'end_word': word_index + word_count - 1,
                    'word_count': word_count
                })
                word_index += word_count

        print(f"[DEBUG] Created {len(subtitles)} subtitle boxes")

        response_data = {
            'success': True,
            'video_path': video_path,
            'transcript': transcript,
            'full_text': full_text,
            'word_count': len(words),
            'subtitles': subtitles
        }
        print(f"[DEBUG] Returning response with {len(subtitles)} subtitles")
        return jsonify(response_data)

    except Exception as e:
        import traceback
        print("[ERROR] Exception in upload_video_with_txt:")
        traceback.print_exc()
        return jsonify({'error': f'Error processing files: {str(e)}'}), 500


@app.route('/upload-clip', methods=['POST'])
def upload_clip():
    """Handle clip/audio file upload for highlights."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Check if it's video or audio
    is_video = allowed_file(file.filename, ALLOWED_VIDEO_EXTENSIONS)
    is_audio = allowed_file(file.filename, ALLOWED_AUDIO_EXTENSIONS)

    if not (is_video or is_audio):
        return jsonify({'error': 'Invalid file type. Please upload a video or audio file.'}), 400

    try:
        filename = secure_filename(file.filename)

        # Save to appropriate folder
        if is_video:
            save_path = os.path.join('clips', filename)
        else:
            save_path = os.path.join('audio_files', filename)

        file.save(save_path)

        return jsonify({
            'success': True,
            'file_path': save_path,
            'file_type': 'video' if is_video else 'audio'
        })

    except Exception as e:
        return jsonify({'error': f'Error uploading file: {str(e)}'}), 500


@app.route('/process-video', methods=['POST'])
def process_video():
    """Process the video with highlights and generate output."""
    try:
        data = request.json

        video_path = data.get('video_path')
        highlights = data.get('highlights', [])
        transcript = data.get('transcript', [])
        subtitles = data.get('subtitles', [])

        if not video_path or not os.path.exists(video_path):
            return jsonify({'error': 'Video file not found'}), 400

        # Build highlight assignments
        assignments = []
        for highlight in highlights:
            assignment = HighlightAssignment(
                phrase=highlight.get('phrase'),
                clip_path=highlight.get('clip_path'),
                music_path=highlight.get('music_path'),
                music_volume=float(highlight.get('music_volume', 1.0)),
                occurrence=int(highlight.get('occurrence', 1)),
                start_word=highlight.get('start_word'),
                end_word=highlight.get('end_word')
            )
            assignments.append(assignment)

        # Generate output filename
        output_filename = f"output_{Path(video_path).stem}.mp4"
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)

        # Convert subtitles to subtitle_segments format (list of tuples)
        subtitle_segments = None
        if subtitles:
            subtitle_segments = [
                (subtitle['start_word'], subtitle['end_word'])
                for subtitle in subtitles
            ]

        # Create project config
        config = ProjectConfig(
            main_video_path=video_path,
            output_path=output_path,
            highlight_assignments=assignments,
            preserve_audio=data.get('preserve_audio', True),
            subtitle_segments=subtitle_segments
        )

        # Render the project with the existing transcript
        result = render_project_with_transcript(config, transcript)

        return jsonify({
            'success': True,
            'output_path': output_path,
            'output_filename': output_filename,
            'message': 'Video processed successfully!'
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Error processing video: {str(e)}'}), 500


@app.route('/download/<filename>')
def download_file(filename):
    """Download the processed video."""
    file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({'error': 'File not found'}), 404


@app.route('/list-clips')
def list_clips():
    """List available clips and audio files."""
    clips = []
    audio_files = []

    if os.path.exists('clips'):
        clips = [f for f in os.listdir('clips') if allowed_file(f, ALLOWED_VIDEO_EXTENSIONS)]

    if os.path.exists('audio_files'):
        audio_files = [f for f in os.listdir('audio_files') if allowed_file(f, ALLOWED_AUDIO_EXTENSIONS)]

    return jsonify({
        'clips': clips,
        'audio_files': audio_files
    })


# This block is not needed for Vercel deployment.

