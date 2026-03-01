"""
llm_cleaner.py

Utility functions to sanitize raw LLM output before returning
it to callers.  Amazon Nova Pro (and Claude) occasionally wraps
JSON responses in markdown code fences:

    ```json
    { ... }
    ```

or returns stray leading/trailing whitespace.  This module strips
all of that so the rest of the system always receives clean text or
clean JSON.
"""

import json
import re
from typing import Any


def clean_llm_output(text: str) -> str:
    """
    Strip markdown code fences and excess whitespace from raw LLM text.

    Handles:
      • ```json\\n...\\n```
      • ```\\n...\\n```
      • ``` ... ``` (inline)
      • Leading/trailing whitespace

    Returns the cleaned plain-text string.
    """
    if not isinstance(text, str):
        return str(text)

    text = text.strip()

    # Remove opening code fence (``` or ```json, ```python, etc.)
    if text.startswith("```"):
        # Find the end of the first line (the fence line)
        first_newline = text.find("\n")
        if first_newline != -1:
            text = text[first_newline + 1:]
        else:
            # Inline fence with no newline — strip opening fence
            text = text[3:]

        # Remove closing fence
        if text.rstrip().endswith("```"):
            text = text.rstrip()[:-3]

    return text.strip()


def clean_llm_json(text: str) -> Any:
    """
    Strip code fences and attempt to parse the result as JSON.

    Returns:
      - Parsed Python object (dict/list) if JSON is valid.
      - {"text": <raw>, "raw": True} if JSON parsing fails but text is present.
      - {"error": "empty"} if nothing is left after cleaning.
    """
    cleaned = clean_llm_output(text)

    if not cleaned:
        return {"error": "empty"}

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Try to extract JSON from embedded text (model added prose before/after)
        # Match the first { ... } or [ ... ] block
        json_match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", cleaned)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass

        return {"text": cleaned, "raw": True}
