import express, { type Express, type Request, type Response } from "express";

const app: Express = express();
const PORT = 3001;

const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req: Request, res: Response) => {
  res.send("/");
});

app.get("/api/persons", (req: Request, res: Response) => {
  console.log("GET persons");
  res.status(200).json(persons);
});

app.get("/info", (req: Request, res: Response) => {
  console.log("GET info");

  res.send(
    `<p>Phonebook has info for: ${persons.length} people.</p><p>${new Date(Date.now()).toUTCString()}</p>`,
  );
});

app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
