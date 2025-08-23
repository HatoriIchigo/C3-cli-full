from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
# import action
import json, os, subprocess, glob
from datetime import datetime
import copy

router = APIRouter()


class ActionRequest(BaseModel):
    workflow_id: str

@router.post("/action")
async def run_command(request: Request, req: ActionRequest):
    data = {
        "id": req.workflow_id
    }

    # 「#」が間に挟まっているパターン
    #   サブノードを実行
    if "#" in req.workflow_id:
        ids = data["id"].split("#")
        node = next(filter(lambda x: x["id"] == ids[0], request.app.state.project_workflow["workflow"]), None)
        cmd = next(filter(lambda x: x["id"] == ids[1], node["command"]), None)
        ret = await run_command(request, cmd)

        if ret["status"] == 0:
            cmd["status"] = "success"
            cmd["date"] = str(datetime.now())
            cmd["result"] = ret["message"]
            update_project(request=request)
            return JSONResponse(content=ret)
        else:
            cmd["status"] = "failed"
            cmd["date"] = str(datetime.now())
            cmd["result"] = ret["message"]
            update_project(request=request)
            return JSONResponse(status_code=500, content=ret)

    # 「#」が間に挟まっていないパターン
    #   最初から実行
    else:

        # workflowを読み込み、実行コマンドを特定
        command = get_workflow_by_id(workflow, data["id"])
        print("COMMAND: ", command)
        
        # ファイルチェック
        if await existFile(command["input"]) is False:
            return JSONResponse(status_code=403, content={"msg": "file not exist"})

        # コマンド実行
        if command["type"] == "claude":
            # await run_claude(command=command["command"])
            pass
    return JSONResponse(content={"test": "abc"})

def get_workflow_by_id(workflow: dict, workflow_id: str) -> dict | None:
    """
    指定したworkflow_idを持つワークフローを返す。
    見つからない場合はNoneを返す。
    """
    for wf in workflow.get("workflow", []):
        if wf.get("id") == workflow_id:
            return wf
    return None


######################
#
#  サブコマンド
#
######################
# run main
async def run_command(request: Request, command: dict):
    result = {"status": 0, "message": ""}
    type = command.get("type", "")
    if type == "bash":
        res = await run_bash(command["command"])
        result["status"] = res.returncode
        if res.returncode == 0:
            result["message"] = res.stdout
        else:
            result["message"] = res.stderr
    elif type == "claude":
        res = await run_claude(command["command"])
        result["status"] = res.returncode
        for line in res.stdout.split("\n")[-3:]:
            if "__exit_0__" in line: result["status"] = 0
            elif "__exit_" in line: result["status"] = 1
        result["message"] = res.stdout
    elif type == "add-workflow":
        result["status"], result["message"] = await add_workflow(request, command["command"])
    else:
        result["status"] = 1
        result["message"] = "No match action type"
    print(result)
    return result

# claude実行
async def run_claude(command: list[str]):
    result = subprocess.run(["claude", "-p", f"/{" ".join(command)}"], cwd="/project", capture_output=True, text=True)
    print(result)
    return result

# bash実行
async def run_bash(command: list):
    result = subprocess.run(command, cwd="/project", capture_output=True, text=True)
    return result

# node追加
async def add_workflow(request: Request, command: list):
    for node in command:
        args = node.get("args", [])
        if len(args) == 0:
            workflow = request.app.state.project_workflow["workflow"]
            node = get_and_convert_node({"template_id": node["id"], "args": {}}, request.app.state.node_template)
            if node is not None:
                workflow.append(node)
            else:
                return 1, "node append to workflow error"

    return 1, "Error"

# ファイルがあるかチェック
async def existFile(files: list[str]) -> bool:
    if len(files) == 0: return True

    for file in files:
        if file["required"] == "no":
            continue
        f = glob.glob(os.path.join("/project", file["file"]))
        if len(f) <= 0:
            return False
    return True
    

#################################
# プロジェクトアップデート
#################################
def update_project(request: Request):
    with open(os.path.join("project", "workflow.json"), "w") as f:
        json.dump(request.app.state.project_workflow, f, indent=4, ensure_ascii=False)
    return

#################################
#
#################################
def get_and_convert_node(request, node_template):
    ret = copy.deepcopy(next(filter(lambda x: x["id"] == request["template_id"], node_template), None))
    if ret is None:
        return None
    for key, value in request["args"].items():
        ret["id"] = ret["id"].replace('${' + key + '}', value)
        ret["name"] = ret["name"].replace('${' + key + '}', value)
        if "description" in ret: ret["description"] = ret["description"].replace('${' + key + '}', value)
        for cmd in ret["command"]:
            cmd["id"] = cmd["id"].replace('${' + key + '}', value)
            cmd["name"] = cmd["name"].replace('${' + key + '}', value)
            if "description" in cmd: cmd["description"] = cmd["description"].replace('${' + key + '}', value)
            cmd["command"] = [c.replace('${' + key + '}', value) for c in cmd["command"]]
    return ret
