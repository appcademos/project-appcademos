APPCADEMOS Server
------

**To start the server [PROD]:**
```
forever start -c "npm start" ./
```

**To stop the server [PROD]:**
Try

```
forever stop ./
```
If it doesn't work, try killing the Node process:

First, search for the process id (pid - 2nd column)
```
ps aux | grep node
```

Then kill the process:
```
kill [pid]
```


**To start the server [DEV]:**

Make sure mongodb is running
```
brew services start mongodb
```

Then
```
npm run dev
```
