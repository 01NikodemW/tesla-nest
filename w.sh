#!/bin/sh

# Wyczyść zawartość pliku file.txt na początku
> file.txt

# Skrót polecenia: Zapisuje wszystkie pliki w folderze src do file.txt z nagłówkiem filepath i treścią
find src -type f | while read file; do
  echo "filepath: $file" >> file.txt
  echo "file content:" >> file.txt
  cat "$file" >> file.txt
  echo "\n" >> file.txt
done
