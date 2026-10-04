type Permission = "read" | "create" | "update" | "delete" | "banned";

type ActivePermission = Exclude<Permission, "banned">;
type WritePermission = Extract<Permission, "create" | "update">;
