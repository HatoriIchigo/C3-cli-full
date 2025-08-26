## GET
curl https://httpbin.org/get
```
{
  "args": {}, 
  "headers": {
    "Accept": "*/*", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/8.2.1", 
    "X-Amzn-Trace-Id": "Root=1-6594009e-4274ba494714ce5829d0a672"
  }, 
  "origin": "114.148.80.191", 
  "url": "https://httpbin.org/get"
}
```


## POST
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "key1=value1&key1=value2&key2=value3" https://httpbin.org/post
```
{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {
    "key1": [
      "value1", 
      "value2"
    ], 
    "key2": "value3"
  }, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "35", 
    "Content-Type": "application/x-www-form-urlencoded", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/8.2.1", 
    "X-Amzn-Trace-Id": "Root=1-65940296-501ee17e2d728da85dbb314b"
  }, 
  "json": null, 
  "origin": "114.148.80.191", 
  "url": "https://httpbin.org/post"
}
```