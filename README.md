# dslog

an extensible structured logging library with discord webhook support

## install

`npm install dslog.js`

## roadmap

- custom embed support
- pipe to log file

## configuration

all config goes into `dslog.config.json` in the project root

```json
{
  "webhookUrl": "discord wh url"
}
```

OR

```json
{
  "webhooks": ["wh url 1", "wh url 2"]
}
```

## usage

### import

```js
const dslog = require("dslog");
```

### all log levels

```js
dslog.OK;
dslog.WARN;
dslog.ERROR;
dslog.INFO;
```

### basic slog

```js
dslog.log(dslog.INFO, "log message");
```

### no date

```js
dslog.log(dslog.INFO, "log message", {
  showDate: false,
});
```

### additional objects

```js
dslog.log(dslog.INFO, "log message", {
  objects: [{ value: 1 }, { value: 2 }],
  prettyPrint: false, // toggle on if you want indents
});
```
