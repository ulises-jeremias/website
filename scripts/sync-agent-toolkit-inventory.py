#!/usr/bin/env python3
"""Regenerate Agent Toolkit inventory snapshot from sibling repo catalogs.

Usage (from website repo root):
  python3 scripts/sync-agent-toolkit-inventory.py
  AGENT_TOOLKIT_ROOT=/path/to/agent-toolkit python3 scripts/sync-agent-toolkit-inventory.py
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from collections import Counter
from pathlib import Path

try:
    import yaml
except ImportError:
    print("PyYAML required: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

WEBSITE_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_AT = WEBSITE_ROOT.parent / "agent-toolkit"
OUT = WEBSITE_ROOT / "src/features/agent-toolkit/data/inventory.snapshot.json"


def clean(text: str | None) -> str:
    return (text or "").replace("WHAT — ", "").replace("WHAT - ", "").strip()


def main() -> int:
    root = Path(os.environ.get("AGENT_TOOLKIT_ROOT", DEFAULT_AT)).resolve()
    if not (root / "catalogs/skill-catalog.yaml").is_file():
        print(f"agent-toolkit catalogs not found at {root}", file=sys.stderr)
        return 1

    commit = subprocess.check_output(["git", "-C", str(root), "rev-parse", "--short", "HEAD"], text=True).strip()
    full = subprocess.check_output(["git", "-C", str(root), "rev-parse", "HEAD"], text=True).strip()
    date = subprocess.check_output(["git", "-C", str(root), "log", "-1", "--format=%cs"], text=True).strip()
    version = (root / "VERSION").read_text(encoding="utf-8").strip()

    skills = yaml.safe_load((root / "catalogs/skill-catalog.yaml").read_text(encoding="utf-8"))["skills"]
    agents = yaml.safe_load((root / "catalogs/agent-catalog.yaml").read_text(encoding="utf-8"))["agents"]
    loops = yaml.safe_load((root / "catalogs/loop-catalog.yaml").read_text(encoding="utf-8"))["loops"]
    domains = Counter(s["domain"] for s in skills)
    packs = sorted(p.name for p in (root / "packs").iterdir() if p.is_dir())
    plugins = sorted(p.name for p in (root / "plugins").iterdir() if p.is_dir())
    profiles = sorted(p.name for p in (root / "profiles").iterdir() if p.is_dir())
    mcp_ids = sorted(p.stem for p in (root / "mcp/registry").glob("*.yaml"))

    def skill_ex(sid: str) -> dict:
        s = next(x for x in skills if x["id"] == sid)
        return {
            "id": s["id"],
            "name": s["name"],
            "domain": s["domain"],
            "description": clean(s["description"])[:180],
            "stability": s.get("stability"),
        }

    def agent_ex(aid: str) -> dict:
        a = next(x for x in agents if x["id"] == aid)
        return {
            "id": a["id"],
            "name": a.get("name", a["id"]),
            "description": clean(a.get("description"))[:180],
        }

    def loop_ex(lid: str) -> dict:
        loop = next(x for x in loops if x["id"] == lid)
        return {
            "id": loop["id"],
            "name": loop.get("name", loop["id"]),
            "description": clean(loop.get("description"))[:180],
            "tier": loop.get("tier"),
            "cadence": loop.get("cadence"),
        }

    def pack_ex(pid: str) -> dict:
        lines = (root / "packs" / pid / "README.md").read_text(encoding="utf-8").splitlines()
        title = lines[0].lstrip("# ").strip()
        blurb = next((ln.strip() for ln in lines[1:] if ln.strip()), title)
        return {"id": pid, "name": title, "description": blurb[:180]}

    def plugin_ex(pid: str) -> dict:
        pj = root / "plugins" / pid / ".claude-plugin" / "plugin.json"
        if pj.exists():
            meta = json.loads(pj.read_text(encoding="utf-8"))
            return {
                "id": pid,
                "name": meta.get("name", pid),
                "description": clean(meta.get("description", ""))[:180],
            }
        readme = (root / "plugins" / pid / "README.md").read_text(encoding="utf-8").splitlines()
        title = readme[0].lstrip("# ").strip()
        blurb = next((ln.strip() for ln in readme[1:] if ln.strip() and not ln.startswith("#")), title)
        return {"id": pid, "name": title, "description": blurb[:180]}

    def mcp_ex(mid: str) -> dict:
        data = yaml.safe_load((root / "mcp/registry" / f"{mid}.yaml").read_text(encoding="utf-8"))
        return {
            "id": mid,
            "name": data.get("display_name") or mid,
            "description": clean(data.get("purpose") or "")[:180],
        }

    snapshot = {
        "source": "ulises-jeremias/agent-toolkit",
        "sourceKind": "CANONICAL_PROJECT_SOURCE",
        "catalogs": [
            "catalogs/skill-catalog.yaml",
            "catalogs/agent-catalog.yaml",
            "catalogs/loop-catalog.yaml",
            "profiles/",
            "packs/",
            "plugins/",
            "mcp/registry/",
        ],
        "commit": commit,
        "commitFull": full,
        "verifiedAt": date,
        "version": version,
        "counts": {
            "skills": len(skills),
            "agents": len(agents),
            "loops": len(loops),
            "profiles": len(profiles),
            "packs": len(packs),
            "plugins": len(plugins),
            "mcp": len(mcp_ids),
            "skillDomains": len(domains),
        },
        "skillDomains": [{"id": k, "count": int(domains[k])} for k in sorted(domains)],
        "profiles": profiles,
        "packs": packs,
        "plugins": plugins,
        "mcp": mcp_ids,
        "agentIds": [a["id"] for a in agents],
        "loopIds": [loop["id"] for loop in loops],
        "examples": {
            "skills": [
                skill_ex("core/assistant"),
                skill_ex("delivery/development-workflow"),
                skill_ex("ops/swarm"),
                skill_ex("forge/github-cli-workflow"),
            ],
            "agents": [
                agent_ex("architect"),
                agent_ex("code-reviewer"),
                agent_ex("tdd-guide"),
                agent_ex("security-reviewer"),
            ],
            "loops": [
                loop_ex("daily-triage"),
                loop_ex("ci-sweeper"),
                loop_ex("pr-babysitter"),
                loop_ex("oss-daily-briefing"),
            ],
            "packs": [pack_ex(p) for p in packs],
            "plugins": [plugin_ex(p) for p in plugins],
            "mcp": [mcp_ex(m) for m in mcp_ids],
        },
    }

    OUT.write_text(json.dumps(snapshot, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT.relative_to(WEBSITE_ROOT)}")
    print(f"  version={version} commit={commit} verifiedAt={date}")
    print(f"  counts={snapshot['counts']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
