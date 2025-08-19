FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PATH="/root/.local/bin:$PATH"

# 基本ツール & Python & Node.js
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv \
    curl git build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# FastAPI & Uvicorn & その他ツール
# RUN pip install --upgrade pip --break-system-packages \
RUN pip install fastapi uvicorn[standard] requests --break-system-packages

# Claude CLI インストール（例: npmパッケージ）
# ※ 公式にCLI配布されている場合のみ（ここでは例として）
RUN npm install -g @anthropic-ai/claude-code

WORKDIR /workspace
EXPOSE 13303

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "13303", "--reload"]
CMD [ "tail", "-f", "/dev/null"]
