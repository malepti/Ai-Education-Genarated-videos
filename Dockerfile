# Multi-stage build for AI Education Video Studio (Hugging Face Docker Space)
FROM python:3.10-slim-bullseye

# Setup non-interactive frontend
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PATH="/home/user/.local/bin:${PATH}"

# Install core system dependencies (FFmpeg, Manim requirements, Blender head-less libraries)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    pkg-config \
    libcairo2-dev \
    libffi-dev \
    libjpeg-dev \
    libgif-dev \
    libpng-dev \
    libpango1.0-dev \
    texlive \
    texlive-latex-extra \
    texlive-fonts-extra \
    texlive-latex-recommended \
    texlive-science \
    texlive-pictures \
    texlive-pstricks \
    ghostscript \
    git \
    wget \
    curl \
    unzip \
    libglu1-mesa-dev \
    libgl1-mesa-glx \
    libxi6 \
    libxrender1 \
    libxxf86vm1 \
    libxkbcommon0 \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Setup Hugging Face User
RUN useradd -m -u 1000 user
WORKDIR /home/user/app

# Install Blender head-less
RUN mkdir -p /home/user/blender && \
    wget -q https://download.blender.org/release/Blender4.0/blender-4.0.2-linux-x64.tar.xz -O blender.tar.xz && \
    tar -xf blender.tar.xz -C /home/user/blender --strip-components=1 && \
    rm blender.tar.xz

ENV PATH="/home/user/blender:${PATH}"

# Install python dependencies
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy all application files
COPY --chown=user . .

# Warm up cached TTS or models
RUN python -c "import os; print('Warming up environments...')"

# Expose port 7860 for Gradio inside Hugging Face Spaces
EXPOSE 7860
ENV GRADIO_SERVER_NAME="0.0.0.0"
ENV GRADIO_SERVER_PORT=7860

# CMD to start the unified FastAPI/Gradio app
CMD ["python", "app.py"]
