from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os, shutil, json, copy
# import workflow

router = APIRouter()


class CreateWorkflowRequest(BaseModel):
    workflow_type: str
    lang: str

@router.post("/create")
async def create_workflow(request: Request, req: CreateWorkflowRequest):
    data = {
        "workflow_type": req.workflow_type,
        "lang": req.lang
    }
    if not data["workflow_type"] in [ "fix", "manual", "new", "rev"]:
        return JSONResponse(status_code=403, content={"msg": "workflow type is invalid"})
    shutil.copy(os.path.join("templates", "workflow", data["workflow_type"] + ".json"), os.path.join("project", "workflow.json"))
    return JSONResponse(content={"msg": "success"})

@router.get("")
async def get_workflow(request: Request):
    return JSONResponse(content=request.app.state.project_workflow)

@router.get("/reload")
async def reload_workflow(request: Request):    
    # プロジェクトのワークフロー読み込み
    workflow_path = os.path.join("project", "workflow.json")
    if os.path.isfile(workflow_path):
        with open(workflow_path) as f:
            request.app.state.project_workflow = json.load(f)
    return JSONResponse(content={"msg": "success"})

@router.get("/node")
async def get_node(request: Request, _id: str) -> dict:
    id = _id.split("#")[0]
    node = None
    for d in request.app.state.project_workflow["workflow"]:
        if d["id"] == id:
            node = d
    if node is None: return JSONResponse(status_code=404, content={"msg": "node not found"})
    return JSONResponse(content=node)

@router.get("/templates")
async def get_templates(request: Request) -> dict:
    return JSONResponse(content=request.app.state.node_template)

class AppendNodeRequest(BaseModel):
    id: str
    args: dict | None = None
    nodeId: str | None = None

@router.post("/append")
async def append_node(request: Request, req: AppendNodeRequest):
    data = {
        "template_id": req.id,
        "args": req.args,
        "node_id": req.nodeId
    }
    if len([node for node in request.app.state.project_workflow["workflow"] if node["id"] == data["template_id"]]) > 0:
        return JSONResponse(status_code=428, content={"errmsg": "node id duplicated"})
    if data["node_id"] is None:
        request.app.state.project_workflow["workflow"].append(get_and_convert_node(data, request.app.state.node_template))
    
    update_project(request=request)
    return JSONResponse(content={"test": "abc"})

@router.delete("/node")
async def delete_node(request: Request, _id: str):
    if any(_id == d["id"] for d in request.app.state.project_workflow["workflow"]):
        request.app.state.project_workflow["workflow"] = [d for d in request.app.state.project_workflow["workflow"] if d["id"] != _id]
        update_project(request=request)
        return JSONResponse(content={"errmsg": "delete successfully"})
    else:
        return JSONResponse(status_code=404, content={"errmsg": "id not found"})

@router.post("/node/create")
async def create_node(request: Request):
    data = await request.json()
    return JSONResponse(content={"test": "abc"})

@router.post("/node/delete")
async def delete_node(request: Request):
    data = await request.json()
    return JSONResponse(content={"test": "abc"})

@router.post("/node/update")
async def update_node(request: Request):
    data = await request.json()
    return JSONResponse(content={"test": "abc"})


def get_and_convert_node(request, node_template):
    ret = copy.deepcopy(next(filter(lambda x: x["id"] == request["template_id"], node_template), None))
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

def update_project(request: Request):
    with open(os.path.join("project", "workflow.json"), "w") as f:
        json.dump(request.app.state.project_workflow, f, indent=4, ensure_ascii=False)
    return
