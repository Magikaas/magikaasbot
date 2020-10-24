#!/bin/sh
# Create new command file

commandFileName="commands/$1.js"

if [ -f $commandFileName ]; then
    echo ERROR: A command with this name already exists
    exit 1
fi

echo "module.exports = {" >> $commandFileName
echo "    name: \"$1\"," >> $commandFileName
echo "    description: \"Command description\"," >> $commandFileName
echo "    async execute(message, args) {" >> $commandFileName
echo "        " >> $commandFileName
echo "    }" >> $commandFileName
echo "};" >> $commandFileName