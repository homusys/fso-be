import express, { type Express, type Request, type Response } from "express";
import morgan from "morgan";

const PORT = 3001;

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

const app: Express = express();

// Sample middleware
const requestLogger = (
  request: Request,
  response: Response,
  next: VoidFunction,
) => {
  next();
};

// Use middleware
app.use(express.json());
app.use(
  morgan((tokens, req: Request, res: Response) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      req.method === "POST" ? JSON.stringify(req.body) : "",
    ].join(" ");
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("/");
});

app.get("/api/persons", (req: Request, res: Response) => {
  res.status(200).json(persons);
});

app.get("/api/persons/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const personFound = persons.find((person) => person.id === id);

  if (!personFound) {
    return res.status(404).end();
  }

  res.json(personFound);
});

app.delete("/api/persons/:id", (req: Request, res: Response) => {
  const id = req.params.id;

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
  let message = { error: "" };

  if (!name || !number) {
    message.error = "The name and number fields are required.";
    return res.status(422).send(message);
  }

  if (
    persons.find((person) => {
      return person.name === name || person.number === number;
    })
  ) {
    message.error = "Either name or number should be unique.";
    return res.status(422).send(message);
  }

  const newPersonRecord = {
    name,
    number,
  } as PersonRecord;

  let max = Math.max(...persons.map((p) => Number(p.id)));
  newPersonRecord.id = String(++max);
  persons.push(newPersonRecord);

  res.status(201).end();
});

app.get("/info", (req: Request, res: Response) => {
  res.send(
    `<p>Phonebook has info for: ${persons.length} people.</p><p>${new Date(Date.now()).toUTCString()}</p>`,
  );
});

app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
