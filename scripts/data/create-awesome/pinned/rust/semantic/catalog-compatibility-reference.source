#!/usr/bin/env python3
"""Registry helpers for layered CI."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
TEMPLATES_JSON = REPO_ROOT / "templates.json"
SCHEMA_JSON = REPO_ROOT / "templates.schema.json"
PROFILES_DIR = REPO_ROOT / "ci" / "profiles"

CRA_REPO_URL = "https://github.com/Create-Rust-App/cra-templates"

# Canonical template directory per extension `type`.
CANONICAL_TEMPLATE_BY_TYPE: dict[str, str] = {
    "axum-backend": "axum-starter",
    "cli": "cli-starter",
    "leptos-fullstack": "leptos-starter",
    "worker": "worker-starter",
    "library": "lib-starter",
    "tonic-grpc": "tonic-starter",
}

# Every known template type (union of template types + extension types).
ALL_TEMPLATE_TYPES: frozenset[str] = frozenset({"axum-backend", "cli", "leptos-fullstack", "tonic-grpc", "worker", "library"})


def load_registry() -> dict[str, Any]:
    return json.loads(TEMPLATES_JSON.read_text(encoding="utf-8"))


def dir_from_url(url: str, kind: str) -> str | None:
    """Resolve on-disk directory name from a registry URL.

    CRA registry URLs look like:
      https://github.com/Create-Rust-App/cra-templates?subdir=templates/axum-starter
    (subdir lives in the query string, not the path).
    """
    prefix = "templates" if kind == "template" else "extensions"
    # Query-string form (canonical for CRA)
    match = re.search(rf"[?&]subdir={prefix}/([^/&]+)(?:/|&|$)", url or "")
    if match:
        return match.group(1)
    # Path form (compat)
    match = re.search(rf"/{prefix}/([^/]+)(?:/|$)", url or "")
    return match.group(1) if match else None


def template_dir(template: dict[str, Any]) -> str | None:
    return dir_from_url(template.get("url", ""), "template")


def extension_dir(extension: dict[str, Any]) -> str | None:
    return dir_from_url(extension.get("url", ""), "extension")


def as_types(type_field: Any) -> list[str]:
    if isinstance(type_field, list):
        return list(type_field)
    return [type_field]


def template_types(registry: dict[str, Any]) -> set[str]:
    types: set[str] = set()
    for template in registry.get("templates", []):
        types.update(as_types(template.get("type")))
    return types


def find_template_by_dir(registry: dict[str, Any], directory: str) -> dict[str, Any] | None:
    for template in registry.get("templates", []):
        if template_dir(template) == directory:
            return template
    return None


def load_profiles() -> list[tuple[str, dict[str, Any]]]:
    profiles: list[tuple[str, dict[str, Any]]] = []
    if not PROFILES_DIR.is_dir():
        return profiles
    for path in sorted(PROFILES_DIR.glob("*.json")):
        profiles.append((path.stem, json.loads(path.read_text(encoding="utf-8"))))
    return profiles


def assert_profile_valid(
    name: str, profile: dict[str, Any], registry: dict[str, Any]
) -> list[str]:
    """Check a CI profile references a real template and compatible extensions."""
    errors: list[str] = []
    template_slug = profile.get("template")
    if not template_slug:
        return [f"profile {name}: missing required key `template`"]
    template = find_template_by_dir(registry, template_slug)
    if template is None:
        errors.append(f"profile {name}: unknown template `{template_slug}`")
        return errors
    template_type = as_types(template.get("type"))[0]
    known_slugs = {e.get("slug") for e in registry.get("extensions", [])}
    for addon in profile.get("extensions", []):
        if addon not in known_slugs:
            errors.append(f"profile {name}: unknown extension `{addon}`")
            continue
        entry = next(e for e in registry["extensions"] if e.get("slug") == addon)
        if template_type not in as_types(entry.get("type")):
            errors.append(
                f"profile {name}: extension `{addon}` incompatible with `{template_slug}`"
            )
    return errors
