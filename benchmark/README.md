As with any other benchmarks, this is not representative of real world usage,
most performance slowdowns could be attributed to your *application* code.

## GET request

```
wrk -t8 -c100 -d30s http://localhost:3030/user/123
```

### srv + router

```
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.71ms    2.59ms  72.35ms   97.53%
    Req/Sec     1.59k   211.22     1.83k    95.21%
  380959 requests in 30.02s, 57.04MB read
Requests/sec:  12692.04
Transfer/sec:      1.90MB

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.40ms  493.90us  18.32ms   86.92%
    Req/Sec     1.63k    89.65     1.82k    88.75%
  389073 requests in 30.02s, 58.25MB read
Requests/sec:  12960.48
Transfer/sec:      1.94MB
```

### polka

```
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.68ms    1.74ms  66.80ms   98.08%
    Req/Sec     2.15k   246.86     2.72k    95.50%
  514567 requests in 30.02s, 64.29MB read
Requests/sec:  17139.35
Transfer/sec:      2.14MB

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.46ms  446.87us  16.19ms   87.69%
    Req/Sec     2.21k   138.88     3.27k    79.50%
  527749 requests in 30.02s, 65.93MB read
Requests/sec:  17578.28
Transfer/sec:      2.20MB
```

### express

```
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    25.03ms    5.71ms 135.22ms   93.24%
    Req/Sec   484.19     79.26   606.00     75.19%
  115673 requests in 30.03s, 25.92MB read
Requests/sec:   3852.19
Transfer/sec:      0.86MB

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    25.83ms    4.21ms  99.65ms   92.58%
    Req/Sec   467.19     59.19   606.00     82.46%
  111708 requests in 30.02s, 25.04MB read
Requests/sec:   3720.66
Transfer/sec:    853.86KB
```

### koa + koa-router

```
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.75ms    2.72ms  72.60ms   97.23%
    Req/Sec     1.59k   223.84     1.82k    95.67%
  380377 requests in 30.02s, 62.39MB read
Requests/sec:  12671.85
Transfer/sec:      2.08MB

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.55ms  775.63us  35.35ms   97.14%
    Req/Sec     1.60k   109.62     1.80k    94.12%
  381677 requests in 30.02s, 62.61MB read
Requests/sec:  12714.80
Transfer/sec:      2.09MB
```
