PART=1
INPUT='input.txt'
METRICS=false
. ./scripts/focusedDay.dat # use focuced day by default

while getopts "p:i:d:tm" arg; do
  case $arg in
    p) PART=$OPTARG;;
    i) INPUT=$OPTARG;;
    d) DAY=$OPTARG;;
    t) INPUT='input.test.txt';;
    m) METRICS=true;;
  esac
done

echo "Day $DAY - Part $PART"
if $METRICS;
then
  time bun run ./days/$DAY/$PART.ts $INPUT
else
  bun run ./days/$DAY/$PART.ts $INPUT
fi
