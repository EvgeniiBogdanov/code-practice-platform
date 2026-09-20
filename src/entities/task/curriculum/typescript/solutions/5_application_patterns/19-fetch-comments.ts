interface Comment {
  id: number;
  email: string;
}

const COMMENTS_URL = "https://jsonplaceholder.typicode.com/comments";

const getData = async (url: string): Promise<Comment[]> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

getData(COMMENTS_URL).then((data) => {
  data.forEach(({ id, email }) => {
    console.log(`ID: ${id}, Email: ${email}`);
  });
});
