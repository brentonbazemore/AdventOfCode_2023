DAY=$(echo $1 | sed 's/^0*//') # trim leading 0s

if [ -z "$DAY" ] || [ "$DAY" -lt 1 ] || [ "$DAY" -gt 25 ]; then
  echo "Day must be between 1 and 25"
  exit 2
fi

if [ -d ./days/$DAY ]
then
  echo "$DAY already exists."
  exit 2
fi

./scripts/focusDay.sh $DAY

mkdir ./days/$DAY
cp -R ./days/template/ ./days/$DAY

git add .
git commit -m "Init Day $DAY"
