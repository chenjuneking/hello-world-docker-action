#!/bin/sh

type mysql >/dev/null 2>&1 && sudo service mysql stop || echo "mysql not present."

commands="docker run"

for volumn in "$INPUT_VOLUMNS"
do
  echo "volumn - $volumn"
done

if [ -n "$INPUT_MYSQLROOTPASSWORD" ]; then
  echo "Root password not empty, use root superuser"
  commands="$commands -e MYSQL_ROOT_PASSWORD=$INPUT_MYSQLROOTPASSWORD"
elif [ -n "$INPUT_MYSQLUSER" ]; then
  if [ -z "$INPUT_MYSQLPASSWORD" ]; then
    echo "The mysql password must not be empty when mysql user specify."
    exit 1
  fi

  echo "Use specified user and password"
  commands="$commands -e MYSQL_RANDOM_ROOT_PASSWORD=true -e MYSQL_USER=$INPUT_MYSQLUSER -e MYSQL_PASSWORD=$INPUT_MYSQLPASSWORD"
else
  echo "Both root password and superuser are empty, must contains one superuser"
  exit 1
fi

if [ -n "$INPUT_MYSQLDATABASE" ]; then
  echo "Use specified database"
  commands="$commands -e MYSQL_DATABASE=$INPUT_MYSQLDATABASE"
fi

commands="$commands -d -p $INPUT_HOSTPORT:$INPUT_CONTAINERPORT mysql:$INPUT_MYSQLVERSION --port=$INPUT_CONTAINERPORT"
commands="$commands --character-set-server=$INPUT_CHARACTERSETSERVER --collation-server=$INPUT_COLLATIONSERVER"

sh -c "$commands"

time=$(date)
results="MySQL $INPUT_MYSQLVERSION set up on $time"
echo "::set-output name=results::$results"