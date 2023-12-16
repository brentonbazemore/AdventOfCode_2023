YEAR=2023
. ./scripts/focusedDay.dat
. .env

PUZZLE_URL="https://adventofcode.com/${YEAR}/day/${DAY}/input"
PUZZLE_FILE="./days/${DAY}/input.txt"
curl "${PUZZLE_URL}" -H "cookie: session=${AOC_SESSION_COOKIE}" -o "${PUZZLE_FILE}" 2>/dev/null
