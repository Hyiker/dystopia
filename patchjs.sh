#!/bin/bash
#!/bin/bash

OS=$(uname -s)

FILE_PATH="media/HDRView.js"

OLD_PATTERN="run(args=arguments_)"
NEW_PATTERN="run(args=hdrViewArgs)"

if [ "$OS" = "Darwin" ]; then
  if command -v sed &>/dev/null; then
    sed -i '' "s/$OLD_PATTERN/$NEW_PATTERN/g" "$FILE_PATH"
  else
    perl -i -pe "s/$OLD_PATTERN/$NEW_PATTERN/g" "$FILE_PATH"
  fi
else
  if command -v sed &>/dev/null; then
    sed -i "s/$OLD_PATTERN/$NEW_PATTERN/g" "$FILE_PATH"
  else
    perl -i -pe "s/$OLD_PATTERN/$NEW_PATTERN/g" "$FILE_PATH"
  fi
fi
