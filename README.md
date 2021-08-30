# A Github Action For Creating MySQL Docker Container

This action create a MySQL docker container.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: actions/hello-world-docker-action@v1
with:
who-to-greet: 'Mona the Octocat'
