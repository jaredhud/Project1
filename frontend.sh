#! /bin/bash


sendCmd="new game"
echo $sendCmd
while [[ "$sendCmd" != "close" ]]; do
    # echo $sendCmd
response=$(curl -X POST http://localhost:4000/ -H "Content-Type: application/json" -d '{"cmd": "'"$sendCmd"'"}' --silent)
echo
echo "$response"
echo
read -p "What would you like to do? " sendCmd
done
exit