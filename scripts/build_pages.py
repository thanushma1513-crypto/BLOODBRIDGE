"""Assemble the static files that GitHub Pages can host from this Flask repo."""

import ast
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"


def main() -> None:
    DIST.mkdir(exist_ok=True)

    module = ast.parse((ROOT / "app.py").read_text(encoding="utf-8"))
    template = next(
        node.value
        for node in module.body
        if isinstance(node, ast.Assign)
        and any(isinstance(target, ast.Name) and target.id == "HTML_TEMPLATE" for target in node.targets)
    )
    (DIST / "index.html").write_text(ast.literal_eval(template), encoding="utf-8")

    for name in ("thalassemia-care.html", "blood-bridge-background.png"):
        shutil.copy2(ROOT / name, DIST / name)


if __name__ == "__main__":
    main()
