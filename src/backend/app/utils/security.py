"""
Security utilities for Teach Charlie AI.

This module provides functions for:
- Sanitizing API keys from responses
- Masking sensitive data
- Input validation and sanitization
"""

import re
import copy
import logging
from typing import Any, Dict, List, Optional, Union

logger = logging.getLogger(__name__)

# Patterns that indicate a sensitive field name
SENSITIVE_FIELD_PATTERNS = [
    "api_key",
    "apikey",
    "api-key",
    "secret",
    "password",
    "token",
    "credential",
    "private_key",
    "privatekey",
    "access_key",
    "accesskey",
]

# Regex patterns for known API key formats
API_KEY_PATTERNS = [
    # OpenAI keys: sk-xxx or sk-proj-xxx
    (r"sk-[a-zA-Z0-9_-]{20,}", "sk-••••••••"),
    # OpenAI project keys
    (r"sk-proj-[a-zA-Z0-9_-]{20,}", "sk-proj-••••••••"),
    # Anthropic keys: sk-ant-xxx
    (r"sk-ant-[a-zA-Z0-9_-]{20,}", "sk-ant-••••••••"),
    # Google API keys
    (r"AIza[a-zA-Z0-9_-]{35}", "AIza••••••••"),
    # AWS access keys
    (r"AKIA[A-Z0-9]{16}", "AKIA••••••••"),
    # Generic long alphanumeric tokens (32+ chars)
    (r"[a-zA-Z0-9_-]{32,}", None),  # Will use mask_secret()
]


def mask_secret(value: str, visible_chars: int = 4) -> str:
    """
    Mask a secret value, showing only first and last few characters.

    Args:
        value: The secret string to mask
        visible_chars: Number of characters to show at start and end

    Returns:
        Masked string like "sk-p••••••••xyz"
    """
    if not value or not isinstance(value, str):
        return value

    if len(value) <= visible_chars * 2 + 4:
        # Too short to meaningfully mask
        return "••••••••"

    return f"{value[:visible_chars]}••••••••{value[-visible_chars:]}"


def is_sensitive_field(field_name: str) -> bool:
    """
    Check if a field name indicates sensitive data.

    Args:
        field_name: The name of the field to check

    Returns:
        True if the field name suggests sensitive content
    """
    if not field_name:
        return False

    field_lower = field_name.lower().replace("-", "_")
    return any(pattern in field_lower for pattern in SENSITIVE_FIELD_PATTERNS)


def sanitize_string_value(value: str) -> str:
    """
    Sanitize a string that might contain API keys.
    Uses regex patterns to detect and mask known key formats.

    Args:
        value: String value to sanitize

    Returns:
        Sanitized string with API keys masked
    """
    if not value or not isinstance(value, str):
        return value

    result = value

    for pattern, replacement in API_KEY_PATTERNS:
        if replacement:
            result = re.sub(pattern, replacement, result)
        else:
            # For generic patterns, use mask_secret on matches
            matches = re.findall(pattern, result)
            for match in matches:
                # Only mask if it looks like a key (has mix of chars/numbers)
                if (any(c.isalpha() for c in match) and
                    any(c.isdigit() for c in match)):
                    result = result.replace(match, mask_secret(match))

    return result


def sanitize_api_keys(
    data: Any,
    depth: int = 0,
    max_depth: int = 50,
    in_place: bool = False,
) -> Any:
    """
    Recursively sanitize API keys from a data structure.

    This function traverses dictionaries and lists, masking any values
    that appear to be API keys based on:
    1. Field names containing 'api_key', 'secret', 'token', etc.
    2. Values matching known API key patterns (sk-xxx, AIza, etc.)

    Args:
        data: The data structure to sanitize (dict, list, or primitive)
        depth: Current recursion depth (internal use)
        max_depth: Maximum recursion depth to prevent stack overflow
        in_place: If True, modifies the original data; if False, creates a copy

    Returns:
        Sanitized data structure with API keys masked
    """
    if depth > max_depth:
        logger.warning(f"Max sanitization depth ({max_depth}) reached, stopping recursion")
        return data

    if data is None:
        return None

    # Handle dictionaries
    if isinstance(data, dict):
        result = data if in_place else {}

        for key, value in (data.items() if in_place else list(data.items())):
            sanitized_value = value

            # Check if this is a sensitive field by name
            if is_sensitive_field(key):
                if isinstance(value, str) and len(value) > 8:
                    sanitized_value = mask_secret(value)
                elif isinstance(value, dict):
                    # Nested dict in sensitive field - sanitize recursively
                    sanitized_value = sanitize_api_keys(value, depth + 1, max_depth)

            # Check if value looks like an API key regardless of field name
            elif isinstance(value, str) and len(value) > 20:
                sanitized_value = sanitize_string_value(value)

            # Recursively handle nested structures
            elif isinstance(value, dict):
                sanitized_value = sanitize_api_keys(value, depth + 1, max_depth)
            elif isinstance(value, list):
                sanitized_value = sanitize_api_keys(value, depth + 1, max_depth)

            if in_place:
                result[key] = sanitized_value
            else:
                result[key] = sanitized_value

        return result

    # Handle lists
    if isinstance(data, list):
        return [sanitize_api_keys(item, depth + 1, max_depth) for item in data]

    # Handle string primitives (check for embedded keys)
    if isinstance(data, str) and len(data) > 20:
        return sanitize_string_value(data)

    # Return other primitives unchanged
    return data


def sanitize_flow_data(flow_data: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Sanitize flow_data specifically for Langflow workflow responses.

    This is the main entry point for sanitizing workflow data before
    returning it to the frontend.

    Args:
        flow_data: The Langflow flow data dictionary

    Returns:
        Sanitized flow data with all API keys masked
    """
    if not flow_data:
        return flow_data

    # Create a deep copy to avoid modifying the original
    sanitized = copy.deepcopy(flow_data)

    # Sanitize the entire structure
    return sanitize_api_keys(sanitized)


def sanitize_for_logging(data: Any, max_length: int = 1000) -> str:
    """
    Sanitize data for safe logging (removes secrets, truncates length).

    Args:
        data: Data to sanitize for logging
        max_length: Maximum length of the output string

    Returns:
        Safe string representation for logging
    """
    sanitized = sanitize_api_keys(data)
    result = str(sanitized)

    if len(result) > max_length:
        result = result[:max_length] + "... [truncated]"

    return result


# Input sanitization utilities

def sanitize_user_input(
    value: str,
    max_length: int = 10000,
    allow_html: bool = False,
) -> str:
    """
    Sanitize user input strings to prevent injection attacks.

    Args:
        value: The input string to sanitize
        max_length: Maximum allowed length
        allow_html: If False, escapes HTML entities

    Returns:
        Sanitized string
    """
    if not value:
        return value

    # Limit length
    result = value[:max_length]

    # Remove null bytes (can cause issues in some systems)
    result = result.replace('\x00', '')

    # Remove other control characters except newlines and tabs
    result = ''.join(
        char for char in result
        if char in '\n\t\r' or (ord(char) >= 32 and ord(char) != 127)
    )

    # Escape HTML if not allowed
    if not allow_html:
        html_escapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
        }
        for char, escape in html_escapes.items():
            result = result.replace(char, escape)

    return result
