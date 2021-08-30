## A github action for creating MySQL docker container

This action create a MySQL docker container.

### Inputs

#### `hostPort`

The port of host. Default `3306`.

#### `containerPort`

The port of container. Default `3306`.

#### `characterSetServer`

--character-set-server - The character set of MySQL server. Default `"utf8mb4"`.

#### `collationServer`

--collation-server - The character collation of MySQL server `"utf8mb4_general_ci"`.

#### `mysqlVersion`

Version of MySQL to use. Default `"latest"`.

#### `mysqlRootPassword`

MYSQL_ROOT_PASSWORD - root superuser password. Default `""`.

#### `mysqlDatabase`

MYSQL_DATABASE - name for the default database that is created. Default `""`.

#### `mysqlUser`

MYSQL_USER - create the specified user with superuser power for created database. Default `""`.

#### `mysqlPassword`

MYSQL_PASSWORD - specified superuser password which user is power for created database. Default `""`.

### Outputs

#### `results`

The result string.

## Example usage

```yml
name: Setup MySQL 8
  uses: chenjuneking/mysql-docker-action@v1
  id: mysql
  with:
    mysqlVersion: 8
    mysqlDatabase: test
    mysqlRootPassword: ${{ secrets.DATABASE_PASSWORD }}
```
