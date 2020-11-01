YINIUS Server
------

**To start the server [PROD]:**
```
pm2 start npm --name "appcademos" -- start
```

**To stop the server [PROD]:**
Try

```
pm2 stop appcademos
```

If it doesn't work, you can try to list all the pm2 processes:
```
pm2 list
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
