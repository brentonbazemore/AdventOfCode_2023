# adventofcode_2023

## Prerequisites
This project uses [bun.sh](https://bun.sh/). Make sure it is installed on your machine before trying to run anything or it'll all just fail to run.

To install dependencies:

```bash
bun install
```

Make sure you make a .env based on the .envtemplate

## Working with the project
### To make a new day:
```bash
bun new <day number>
```

**Note:** Creating a new day will "focus" that day so the day parameter can be omitted in most cases. It is possible to manually focus a new day, and also possible to manually run specific days that aren't focused in some commands.

### To run part 1:
```bash
bun p1
```

### To run part 2:
```bash
bun p2
```

### To run with `input.test.txt` as input:
```bash
bun p(1|2) -t
```

### To run with any file as input:
```bash
bun p(1|2) -i <any file in the day's folder>
```

### To run with metrics:
```bash
bun p(1|2) -m
```

### To run with a specific day:
```bash
bun p(1|2) -d <any existing day>
```

**Note:** The options can be combined: `bun p1 -d4 -mt`

### To focus another day:
```bash
bun focus <any existing day>
```

### To finish part 1 and move to part 2:
```bash
bun next
```

### To finish part 2:
```bash
bun finish
```

### To debug:
`CMD` + `Shift` + `P`: `Bun: Debug File`

More info here: https://bun.sh/guides/runtime/vscode-debugger

### To load your daily input into input.txt
```bash
bun input
```

**Note:** You will need to put your session cookie in .env for this to work.

## Useful References
- [Applied DFS / BFS](https://adrianmejia.com/how-to-solve-any-graph-2d-arrays-maze-interview-questions-in-javascript-dfs-vs-bfs/)
- Multithreading example can be found in `./multithreaded`