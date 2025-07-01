# app/core/acl.py

role_permissions = {
    "admin": [
        "products", "inventories", "receivings", "warehouses",
        "route_planning", "shipments", "notifications", "reports"
    ],
    "warehouse": [
        "products", "inventories", "receivings", "warehouses_readonly",
        "notifications", "reports"
    ],
    "delivery_planning": [
        "route_planning", "shipments_readonly", "notifications"
    ],
    "driver": [
        "route_planning", "notifications"
    ]
}

def has_permission(role: str, permission: str) -> bool:
    perms = role_permissions.get(role, [])
    return permission in perms or permission + "_readonly" in perms
