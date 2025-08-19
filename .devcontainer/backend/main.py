from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from workflow.workflow import router as workflow_router
from action.action import router as action_router

import os, json

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初期化データ
@app.on_event("startup")
def startup_event():
    # ワークフローのテンプレート読み込み
    app.state.node_template = []
    dir_path = os.path.join("templates", "node")
    for fname in os.listdir(dir_path):
        relative_fname = os.path.join(dir_path, fname)
        with open(relative_fname) as f:
            app.state.node_template.append(json.load(f))

    # プロジェクトのワークフロー読み込み
    workflow_path = os.path.join("project", "workflow.json")
    if os.path.isfile(workflow_path):
        with open(workflow_path) as f:
            app.state.project_workflow = json.load(f)


# ルーターを登録
app.include_router(workflow_router, prefix="/workflow", tags=["Workflow"])
app.include_router(action_router, prefix="/action", tags=["Action"])
