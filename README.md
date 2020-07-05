# Hasura Triggers

hasura triggers for simplified (single endpoint)

## Installation

```
npm i --save hasura-triggers
```

## Usage

```javascript
const express = require("express");
const hasuraTriggers = require("hasura-triggers");
const config = require("./config");

const app = express();

app.use("/hasura/triggers", hasuraTriggers(config))

app.listen(3000, function(err){
    if(err) console.log(err.message);
    else console.log("Listening on localhost:3000");
})
```

## config.js

```javascript
const { updateEvent, deleteEvent } = require("./handlers");

module.exports = {
    schema_name: {
        table_name: {
            insert: async function(body, headers){
                // Custom Buisness Logic
                return {
                    message: "operation successful"
                }
            },
            update: updateEvent,
            delete: deleteEvent
        }
    }
}
```