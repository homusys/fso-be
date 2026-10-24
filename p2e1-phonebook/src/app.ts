import express, { type Express, type Request, type Response } from "express";

const PORT = 3001;

const app: Express = express();
app.use(express.json());

type PersonRecord = {
  id: string;
  name: string;
  number: string;
};

let persons = [
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
] as PersonRecord[];

app.get("/", (req: Request, res: Response) => {
  res.send("/");
});

app.get("/api/persons", (req: Request, res: Response) => {
  console.log("GET persons");
  res.status(200).json(persons);
});

app.get("/api/persons/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(`GET persons:id=${id}`);

  const personFound = persons.find((person) => person.id === id);

  if (!personFound) {
    return res.status(404).end();
  }

  res.json(personFound);
});

app.delete("/api/persons/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(`GET persons:id=${id}`);

  let newPersons = persons.filter((person) => person.id !== id);

  if (newPersons.length === persons.length) {
    return res.status(404).end();
  } else {
    persons = newPersons;
    res.status(204).end();
  }
});

app.post("/api/persons", (req: Request, res: Response) => {
  const p = req.body;

  const name = p.name;
  const number = p.number;

  if (!name || !number) {
    return res.status(422).send("The name or number fields are required!");
  }

  let nameOrNumber: "name" | "number" | null = null;

  if (
    persons.find((person) => {
      if (person.name === name) {
        nameOrNumber = "name";
        return true;
      }

      if (person.number === number) {
        nameOrNumber = "number";
        return true;
      }

      return undefined;
    })
  ) {
    return res
      .status(422)
      .send(`The ${nameOrNumber ?? "%%"} already exists on the database!`);
  }

  const newPersonRecord = {
    name,
    number,
  } as PersonRecord;

  let max = Math.max(...persons.map((p) => Number(p.id)));
  newPersonRecord.id = String(++max);
  persons.push(newPersonRecord);

  console.log(persons);
  res.status(201).end();
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
