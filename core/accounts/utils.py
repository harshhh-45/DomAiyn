import re
from django.core.exceptions import ValidationError

# Basic SQL injection pattern detection
SQL_PATTERNS = re.compile(
    r"(--|;|'|\"|\/\*|\*\/|xp_|UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|CAST|CONVERT)",
    re.IGNORECASE
)

def check_sql_injection(value, field_name='Field'):
    """
    Validates that the given value does not contain common SQL injection patterns.
    Raises ValidationError if a pattern is found.
    """
    if SQL_PATTERNS.search(value):
        raise ValidationError(f"{field_name} contains invalid characters.")
