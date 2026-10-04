interface User {
  id: number;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}

const isUser = (value: unknown): value is User =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof value.id === "number" &&
  "name" in value &&
  typeof value.name === "string";

const isAdmin = (person: User | Admin): person is Admin =>
  "permissions" in person;

const input: unknown = JSON.parse('{"id": 1, "name": "Alice"}');

if (isUser(input)) {
  console.log(input.name); // input: User
}

const people: (User | Admin)[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob", permissions: ["users:write"] },
];

const admins: Admin[] = people.filter(isAdmin);
console.log(admins.map((admin) => admin.permissions));
