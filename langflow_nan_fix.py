import math


def _serialize_primitive(obj, *_):
    """Handle primitive types without conversion.

    PATCHED: Convert NaN and Inf to None for PostgreSQL JSON compatibility.
    """
    if obj is None or isinstance(obj, int | bool | complex):
        return obj
    if isinstance(obj, float):
        # Convert NaN and Inf to None for JSON compatibility
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    return None  # Sentinel will be imported from the module
