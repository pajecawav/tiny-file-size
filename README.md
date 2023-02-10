# tiny-file-size [![npm](https://img.shields.io/npm/v/tiny-file-size)](https://www.npmjs.com/package/tiny-file-size)

CLI tool for calculating size of files on disk. Can optionally display sizes after gzip and brotli.

<p align="center">
    <img src="https://user-images.githubusercontent.com/18193831/216993542-c0ecf21b-df63-4aba-a5a7-1fec497192ad.png" alt="Screenshot" width="738">
</p>

## Install

```sh
npm install -g tiny-file-size

# or

yarn add -g tiny-file-size

# or

pnpm add -g tiny-file-size
```

## Usage

```sh
file-size --gzip --brotli foo.js README.md example.json
```

## Help

You can run `file-size --help` to get a help message:

```
Usage:
  file-size [options] [globs...]

Options:
  -h, --help                     Show help
  -g, --gzip                     Include gzip size in output
  -b, --brotli                   Include brotli size in output
      --total                    Include total size in output
      --json                     Print result as json
  -v, --version                  Print the current version and exit

Examples:
  # Show sizes of files foo.js and bar.json
  file-size foo.js bar.json

  # Include sizes after gzip and brotli
  file-size --gzip --brotli foo.js bar.json

  # Print output as JSON
  file-size --json foo.js bar.json
```
