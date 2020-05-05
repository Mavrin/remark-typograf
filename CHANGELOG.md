## 2.1.5 (May 5, 2020)

fix case with inline code

## 2.1.4 (May 5, 2020)

use visit method instead of own tree walker

## 2.1.3 (May 5, 2020)

use files section in package.json instead of .npmignore

## 2.1.2 (May 5, 2020)

Fix case with mark and punctuation. Before the fix, plugin add an unnecessary comma.

```
    **Categories,** а у родительского тега // original markdonw
    **Categories,**, а у родительского тега // before the fix
    **Categories,** а у родительского тега // after the fix
```

## 2.1.1 (Apr 26, 2020)

Fix readme

## 2.1.0 (Apr 26, 2020)

Add `keywords` config. Strings from this config will be not typografed.

## 2.0.1 (Apr 24, 2020)

Now typograf is built-in to plugin. Also was added remark-cli support.

### Breaking Changes

Plugin use builtIn typograf. If you want use custom typograf set `builtIn`option to false.

## 1.0.0 (Apr 20, 2020)

Initial version.
