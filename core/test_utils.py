from accounts.utils import check_sql_injection
from django.core.exceptions import ValidationError

try:
    check_sql_injection("admin' OR '1'='1", 'Username')
    print("❌ Failed to catch injection")
except ValidationError as e:
    print(f"✅ Caught injection: {e}")

try:
    check_sql_injection("normaluser", 'Username')
    print("✅ Normal user passed")
except ValidationError as e:
    print(f"❌ Normal user blocked: {e}")
