. ./scripts/focusedDay.dat

if [ -f ./days/$DAY/2.ts ]
then
  echo "Part 2 already exists."
  exit 2
fi

git add .
git commit -m "Finish Day $DAY - Part 1"

cp ./days/$DAY/1.ts ./days/$DAY/2.ts

git add .
git commit -m "Init Day $DAY - Part 2"
