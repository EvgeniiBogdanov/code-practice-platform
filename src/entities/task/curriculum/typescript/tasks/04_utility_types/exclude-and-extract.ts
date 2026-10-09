// На основе типа допустимых прав доступа создайте:
// тип ActivePermission без права "banned",
// и тип WritePermission, содержащий только права, связанные с изменением данных
// ("create", "update").

type Permission = "read" | "create" | "update" | "delete" | "banned";
